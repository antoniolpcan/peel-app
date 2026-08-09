import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ListChecks, Bell, MessageSquare, CheckCircle2 } from 'lucide-react';
import logoSvg from '../../assets/logo.svg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const POSTIT_TYPES = {
  ideia: {
    label: 'Ideia',
    icon: Lightbulb,
    cardBg: 'bg-yellow-200 dark:bg-yellow-300 text-slate-900',
    headerText: 'text-yellow-900',
    iconColor: 'text-yellow-800',
    tapeClass: '-rotate-2',
    rotateClass: '-rotate-3',
  },
  checklist: {
    label: 'Checklist',
    icon: ListChecks,
    cardBg: 'bg-indigo-200 dark:bg-indigo-300 text-slate-900',
    headerText: 'text-indigo-900',
    iconColor: 'text-indigo-800',
    tapeClass: 'rotate-3',
    rotateClass: 'rotate-2',
  },
  lembrete: {
    label: 'Lembrete',
    icon: Bell,
    cardBg: 'bg-pink-200 dark:bg-pink-300 text-slate-900',
    headerText: 'text-pink-900',
    iconColor: 'text-pink-800',
    tapeClass: '-rotate-1',
    rotateClass: 'rotate-3',
  },
  direct: {
    label: 'Direct',
    icon: MessageSquare,
    cardBg: 'bg-emerald-200 dark:bg-emerald-300 text-slate-900',
    headerText: 'text-emerald-900',
    iconColor: 'text-emerald-800',
    tapeClass: 'rotate-2',
    rotateClass: '-rotate-2',
  },
};

const SAMPLE_POSTITS = [
  { type: 'ideia', text: 'Lançar filtros por cor no mural 🚀' },
  { type: 'ideia', text: 'Criar modo escuro automático por horário 🌙' },
  { type: 'ideia', text: 'Exportar notas para PDF em um clique 📄' },
  { type: 'checklist', text: 'Chat em tempo real funcionando' },
  { type: 'checklist', text: 'Refatorar chamadas do backend' },
  { type: 'checklist', text: 'Testar responsividade no mobile 📱' },
  { type: 'lembrete', text: 'Reunião de alinhamento às 15h ☕' },
  { type: 'lembrete', text: 'Beber água e fazer uma pausa 💧' },
  { type: 'lembrete', text: 'Comprar mais café para a semana ☕' },
  { type: 'direct', text: 'Alguém enviou uma nova mensagem 💬' },
  { type: 'direct', text: 'Alguém reagiu à sua nota "Sprint 3" ❤️' },
  { type: 'direct', text: 'Alguém te marcou no post-it da equipe 📌' },
];

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  const [activeCards, setActiveCards] = useState<typeof SAMPLE_POSTITS>([]);

  const shuffleCards = () => {
    const types = ['ideia', 'checklist', 'lembrete', 'direct'];
    const selected = types.map((type) => {
      const filtered = SAMPLE_POSTITS.filter((item) => item.type === type);
      return filtered[Math.floor(Math.random() * filtered.length)];
    });
    setActiveCards(selected);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="min-h-screen w-full bg-app-bg text-app-text flex items-center justify-center p-4 relative overflow-hidden selection:bg-app-accent selection:text-white">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-app-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 p-2">
          <div className="flex items-center gap-2.5">
            <div className="w-20 h-20 rounded-2xl bg-app-card flex items-center justify-center shadow-lg shadow-app-bg/30 p-2">
              <img src={logoSvg} alt="Logo Peel" className="w-full h-full object-contain" />
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

          <div className="grid grid-cols-2 gap-4 pt-3 relative">
            {activeCards.map((card, index) => {
              const config = POSTIT_TYPES[card.type as keyof typeof POSTIT_TYPES];
              const Icon = config.icon;

              return (
                <div
                  key={index}
                  className={`relative p-3.5 ${config.cardBg} ${config.rotateClass} rounded-xs shadow-md hover:rotate-0 hover:scale-105 transition-all duration-300 flex flex-col justify-start gap-2 min-h-24`}
                >
                  <div
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/50 border border-white/40 backdrop-blur-[1px] ${config.tapeClass} shadow-2xs pointer-events-none`}
                  />

                  <div className={`flex items-center justify-between ${config.headerText} font-bold text-[10px]`}>
                    <span className="flex items-center gap-1">
                      <Icon className={`w-3 h-3 ${config.iconColor}`} /> {config.label}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-800 leading-snug flex items-center gap-1">
                    {card.type === 'checklist' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    )}
                    <span className="truncate">{card.text}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-app-card/60 backdrop-blur-xl border border-app-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-12 h-12 bg-app-accent/10 border-b border-l border-app-border/60 rounded-bl-2xl pointer-events-none" />
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <img src={logoSvg} alt="Logo Peel" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-app-text">Peel</span>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-app-muted mt-1">{subtitle}</p>
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