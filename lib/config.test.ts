import { describe, it, expect } from 'vitest';

describe('Configurações de Ambiente', () => {
  it('deve carregar a URL do Supabase', () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toContain('supabase.co');
  });

  it('deve carregar a chave anônima do Supabase', () => {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(10);
  });

  it('deve carregar a chave da API do Gemini', () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    expect(key).toBeDefined();
    expect(key).toMatch(/^AIzaSy/);
  });
});
