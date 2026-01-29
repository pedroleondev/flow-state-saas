# Script para Buildar e Pushar a imagem Docker com as variáveis de ambiente corretas

# Carregar variáveis do .env.local
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
} else {
    Write-Host "Erro: Arquivo .env.local não encontrado. Crie-o antes de continuar." -ForegroundColor Red
    exit 1
}

$IMAGE_NAME = "pedroleonpython/flow-state"
$TAG = "latest"

Write-Host "Iniciando Build da imagem $IMAGE_NAME:$TAG..." -ForegroundColor Cyan

# Executar o build passando as variáveis como argumentos
docker build . -t "$IMAGE_NAME:$TAG" `
    --build-arg VITE_SUPABASE_URL=$env:VITE_SUPABASE_URL `
    --build-arg VITE_SUPABASE_ANON_KEY=$env:VITE_SUPABASE_ANON_KEY `
    --build-arg VITE_GEMINI_API_KEY=$env:VITE_GEMINI_API_KEY

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build concluído com sucesso!" -ForegroundColor Green
    
    Write-Host "Enviando para o Docker Hub..." -ForegroundColor Cyan
    docker push "$IMAGE_NAME:$TAG"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Sucesso! Imagem enviada para: $IMAGE_NAME:$TAG" -ForegroundColor Green
    } else {
        Write-Host "Erro ao enviar imagem. Verifique se você está logado (docker login)." -ForegroundColor Red
    }
} else {
    Write-Host "Erro no Build." -ForegroundColor Red
}
