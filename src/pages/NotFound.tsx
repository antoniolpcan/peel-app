import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-(--bg-main,#0b0f19) text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      <div className="absolute w-125 h-125 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-md w-full flex flex-col items-center gap-8 z-10">
        
        <div className="relative w-full bg-[#e2d5ff] text-slate-900 p-8 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] -rotate-1">
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 backdrop-blur-sm rounded-sm shadow-sm border border-white/20 rotate-1 pointer-events-none" />

          <div className="flex items-center justify-between mb-4 border-b border-slate-900/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900/10 flex items-center justify-center font-bold text-xs">
                404
              </div>
              <span className="text-xs font-semibold tracking-wide uppercase opacity-60">
                Página Perdida
              </span>
            </div>
            <span className="text-xs font-medium opacity-50">há 0 mins</span>
          </div>

          <div className="space-y-3 my-4">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              Ops! Esse post-it descolou do mural. 🍃
            </h1>
            <p className="text-sm font-medium opacity-80 leading-relaxed">
              A página que você está procurando não existe ou foi colada em outro lugar.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-600 text-white shadow-md">
              📌 Erro 404
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Voltar ao Mural</span>
          </Link>
        </div>

      </div>
    </div>
  );
}