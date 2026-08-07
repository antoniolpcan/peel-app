import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Pin, CheckCircle2, Bell, MessageSquare } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-app-bg text-app-text flex items-center justify-center p-4 relative overflow-hidden selection:bg-app-accent selection:text-white">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-app-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 p-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-app-accent flex items-center justify-center shadow-lg shadow-app-accent/30 text-white font-extrabold text-xl">
              🌿
            </div>
            <span className="text-2xl font-black tracking-tight text-app-text">Peel</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-app-text leading-snug">
              Cole suas ideias. <br />
              <span className="text-app-accent">Organize sua mente.</span>
            </h2>
            <p className="text-xs text-app-muted mt-1.5 leading-relaxed">
              Sua central pessoal de pensamentos, tarefas e conversas em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3">
            <div className="relative p-3.5 bg-yellow-200 dark:bg-yellow-300 text-slate-900 rounded-xs -rotate-3 shadow-md hover:rotate-0 hover:scale-105 transition-all duration-300 flex flex-col justify-start gap-2 min-h-24">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/50 border border-white/40 backdrop-blur-[1px] -rotate-2 shadow-2xs pointer-events-none" />
              
              <div className="flex items-center justify-between text-yellow-900 font-bold text-[10px]">
                <span className="flex items-center gap-1">
                  <Pin className="w-3 h-3 text-yellow-800" /> Ideia
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 leading-snug">
                Lançar filtros por cor no mural 🚀
              </p>
            </div>

            <div className="relative p-3.5 bg-indigo-200 dark:bg-indigo-300 text-slate-900 rounded-xs rotate-2 shadow-md hover:rotate-0 hover:scale-105 transition-all duration-300 flex flex-col justify-start gap-2 min-h-24">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/50 border border-white/40 backdrop-blur-[1px] rotate-3 shadow-2xs pointer-events-none" />

              <div className="flex items-center justify-between text-indigo-900 font-bold text-[10px]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-800" /> Checklist
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 flex items-center gap-1 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                Chat em tempo real
              </p>
            </div>

            <div className="relative p-3.5 bg-pink-200 dark:bg-pink-300 text-slate-900 rounded-xs rotate-3 shadow-md hover:rotate-0 hover:scale-105 transition-all duration-300 flex flex-col justify-start gap-2 min-h-24">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/50 border border-white/40 backdrop-blur-[1px] -rotate-1 shadow-2xs pointer-events-none" />

              <div className="flex items-center justify-between text-pink-900 font-bold text-[10px]">
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3 text-pink-800" /> Lembrete
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 leading-snug">
                Reunião de alinhamento às 15h ☕
              </p>
            </div>

            <div className="relative p-3.5 bg-emerald-200 dark:bg-emerald-300 text-slate-900 rounded-xs -rotate-2 shadow-md hover:rotate-0 hover:scale-105 transition-all duration-300 flex flex-col justify-start gap-2 min-h-24">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/50 border border-white/40 backdrop-blur-[1px] rotate-2 shadow-2xs pointer-events-none" />

              <div className="flex items-center justify-between text-emerald-900 font-bold text-[10px]">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-800" /> Direct
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 leading-snug truncate">
                Antonio enviou mensagem 💬
              </p>
            </div>

          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-app-card/60 backdrop-blur-xl border border-app-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-12 h-12 bg-app-accent/10 border-b border-l border-app-border/60 rounded-bl-2xl pointer-events-none" />
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold tracking-tight text-app-text">Peel</span>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-app-muted mt-1">
                {subtitle}
              </p>
            </div>
            {children}
            <div className="mt-6 pt-4 border-t border-app-border/40 text-center text-xs text-app-muted">
              {footerText}{' '}
              <Link
                to={footerLinkTo}
                className="font-bold text-app-accent hover:underline transition-all inline-flex items-center gap-0.5"
              >
                {footerLinkText}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}