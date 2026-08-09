import { memo } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';

export const NavBrand = memo(function NavBrand() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 rounded-xl"
    >
      <img 
        src={logoSvg} 
        alt="Logo Peel" 
        className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 object-contain" 
      />
      <span className="text-lg sm:text-xl font-black tracking-tight text-app-text whitespace-nowrap">
        Peel
      </span>
    </Link>
  );
});