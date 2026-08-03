import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthLayout({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2 text-center">🌿 Peel</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">{title}</h2>

        {children}

        <p className="mt-6 text-center text-gray-500 text-sm">
          {footerText}{' '}
          <Link to={footerLinkTo} className="text-indigo-600 font-semibold hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}