import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../styles/Breadcrumb.css';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="breadcrumb">
      <Link to="/dashboard" className="breadcrumb-link home-link">
        <Home size={14} />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <span key={name} className="breadcrumb-item">
            <ChevronRight size={14} className="breadcrumb-separator" />
            {isLast ? (
              <span className="breadcrumb-current">{displayName}</span>
            ) : (
              <Link to={routeTo} className="breadcrumb-link">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
