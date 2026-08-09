import { memo } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';

export const NavBrand = memo(function NavBrand() {
  return (
    <Link 
      to="/" 
      className="text-xl font-bold text-app-accent flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <div className="flex items-center gap-2">
        <img src={logoSvg} alt="Logo Peel" className="w-10 h-10" />
        <span>Peel</span>
      </div>
    </Link>
  );
});