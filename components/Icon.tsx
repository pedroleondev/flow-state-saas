import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  Clock, 
  Settings, 
  MoreHorizontal, 
  Share2, 
  Menu,
  Plus,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Zap,
  Search,
  Calendar,
  User,
  Trash2,
  X,
  Play,
  Pause,
  Check,
  Moon,
  Sun,
  GitBranch,
  Monitor,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  Filter,
  Home,
  List,
  Pencil,
  Eye,
  EyeOff,
  Lock,
  LogOut
} from 'lucide-react';
import { TaskType } from '../types';

export const TaskTypeIcon = ({ type, className = "w-4 h-4" }: { type: TaskType, className?: string }) => {
  switch (type) {
    case 'PENSAR': return <Lightbulb className={className} />;
    case 'RESPONDER': return <MessageSquare className={className} />;
    case 'EXECUTAR': return <Zap className={className} />;
    default: return <Lightbulb className={className} />;
  }
};

// Exporting other icons for general usage
export {
  LayoutDashboard,
  BarChart2,
  Clock,
  Settings,
  MoreHorizontal,
  Share2,
  Menu,
  Plus,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Zap,
  Search,
  Calendar,
  User,
  Trash2,
  X,
  Play,
  Pause,
  Check,
  Moon,
  Sun,
  GitBranch,
  Monitor,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  Filter,
  Home,
  List,
  Pencil,
  Eye,
  EyeOff,
  Lock,
  LogOut
};