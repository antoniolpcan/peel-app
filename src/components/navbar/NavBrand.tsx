import { memo } from 'react';
import { Link } from 'react-router-dom';

export const NavBrand = memo(function NavBrand() {
  return (
    <Link 
      to="/" 
      className="text-xl font-bold text-app-accent flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <span>🌿</span> Peel
    </Link>
  );
});