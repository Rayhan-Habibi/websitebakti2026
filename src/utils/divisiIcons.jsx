import React from 'react';
import { 
  Crown, 
  BookOpen, 
  Megaphone, 
  Users, 
  MonitorSmartphone, 
  Utensils, 
  Camera, 
  Package, 
  ShieldAlert,
  Globe,
  CakeSlice,
  Hammer,
  NotebookPen,
  Cog,
  ChessQueen,
  ShieldPlus,
  Clapperboard
} from 'lucide-react';

export const getDivisiIcon = (divisiName, className = "") => {
  if (!divisiName) return <Users className={className} />;
  
  const name = divisiName.toLowerCase();
  
  if (name.includes('global')) return <Globe className={className} />;
  
  // Role scopes baru
  if (name.includes('pimpinan') || name.includes('leaders')) return <ChessQueen className={className} />;
  if (name.includes('koor')) return <Users className={className} />;
  if (name.includes('internal')) return <ShieldPlus className={className} />;

  // Divisi
  if (name.includes('inti')) return <ChessQueen className={className} />;
  if (name.includes('kestari')) return <NotebookPen className={className} />;
  if (name.includes('acara')) return <Cog className={className} />;
  if (name.includes('co fasilitator') || name.includes('cofas')) return <Users className={className} />;
  if (name.includes('mit')) return <Clapperboard className={className} />;
  if (name.includes('konsumsi')) return <CakeSlice className={className} />;
  if (name.includes('mng') || name === 'mng') return <ShieldPlus className={className} />;
  if (name.includes('perlengkapan')) return <Hammer className={className} />;
  if (name.includes('rnb') || name === 'rnb') return <Clapperboard className={className} />;
  
  // Default icon if not found
  return <Users className={className} />;
};
