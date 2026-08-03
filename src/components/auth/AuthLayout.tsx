import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-app-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-app-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md bg-app-card border border-app-border rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-2xl font-bold text-app-accent mb-2 hover:scale-105 transition-transform"
          >
            🌿 Peel
          </Link>
          <h1 className="text-2xl font-bold text-app-text tracking-tight mt-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-app-muted mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
        <div className="mt-8 pt-6 border-t border-app-border text-center text-sm text-app-muted">
          <span>{footerText} </span>
          <Link
            to={footerLinkTo}
            className="font-semibold text-app-accent hover:underline transition-all"
          >
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}