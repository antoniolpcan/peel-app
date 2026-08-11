import { memo } from 'react';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import logoSvg from '@/assets/logo.svg';

interface AuthSlidingOverlayProps {
  isRegisterMode: boolean;
  onToggleMode: (mode: 'login' | 'register') => void;
}

export const AuthSlidingOverlay = memo(function AuthSlidingOverlay({
  isRegisterMode,
  onToggleMode,
}: AuthSlidingOverlayProps) {
  return (
    <div
      className={`hidden md:flex absolute top-0 bottom-0 w-1/2 bg-app-accent text-app-accent-text transition-transform duration-500 ease-in-out z-20 flex-col justify-between p-10 text-center shadow-2xl overflow-hidden ${
        isRegisterMode ? 'translate-x-0 rounded-r-3xl' : 'translate-x-full rounded-l-3xl'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-size-[18px_18px] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center gap-3.5 pt-2">
        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-lg border border-white/25 p-3 flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105">
          <img 
            src={logoSvg} 
            alt="Logo Peel" 
            className="w-full h-full object-contain filter drop-shadow-md" 
          />
        </div>
        <span className="text-4xl font-black tracking-tight text-white drop-shadow-md">
          Peel
        </span>
      </div>

      <div className="relative z-10 my-auto w-full max-w-xs mx-auto">
        <div
          className={`relative p-8 rounded-3xl text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-black/5 flex flex-col items-center gap-4 transition-all duration-300 ${
            isRegisterMode
              ? 'bg-[#fef3c7] -rotate-1 hover:rotate-0'
              : 'bg-white rotate-1 hover:rotate-0'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 shadow-xs -rotate-1 backdrop-blur-xs rounded-xs pointer-events-none border border-white/60" />

          {isRegisterMode ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-800">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Já é de casa?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Acesse sua conta para ver suas notas, recados e interações no seu mural pessoal.
              </p>
              <button
                type="button"
                onClick={() => onToggleMode('login')}
                className="mt-2 w-full py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Fazer Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-3 rounded-2xl bg-app-accent/10 text-app-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Novo por aqui?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Junte-se ao Peel para colar suas ideias, compartilhar momentos e organizar sua rotina.
              </p>
              <button
                type="button"
                onClick={() => onToggleMode('register')}
                className="mt-2 w-full py-2.5 px-5 rounded-xl bg-app-accent hover:opacity-95 text-app-accent-text font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Cadastrar-se Grátis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 shrink-0">
        <p className="text-[11px] text-white/80 font-medium">
          Cole suas ideias. Organize sua mente.
        </p>
      </div>
    </div>
  );
});