import { useState } from 'react';
import { useColors } from '@/hooks/useColors';
import { usePostActions } from '@/hooks/usePosts';
import { useToast } from '@/contexts/ToastContext';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedColor, setSelectedColor] = useState<number | undefined>(undefined);

  const { colors } = useColors();
  const { createPost, loading: isLoading } = usePostActions();

  const currentColor = colors.find((c) => c.id === selectedColor);

  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      addToast('Preencha o título e o corpo da nota!');
      return;
    }

    const created = await createPost({
      title,
      body,
      color_id: selectedColor || null,
    });

    if (created) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full relative shadow-2xl border border-slate-100 flex flex-col gap-5">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📌</span> Criar Novo Post-it
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div
          className="rounded-2xl p-6 min-h-65 flex flex-col shadow-inner transition-colors duration-300 border border-black/5"
          style={{
            backgroundColor: currentColor ? currentColor.hex_code : '#FEF9C3',
          }}
        >
          <input
            type="text"
            placeholder="Título do Post-it..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold bg-transparent outline-none placeholder:text-slate-700/50 text-slate-800 mb-3"
          />

          <textarea
            placeholder="Escreva sua nota aqui..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full grow bg-transparent outline-none resize-none placeholder:text-slate-700/40 text-slate-800 text-base leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          {colors.length > 0 ? (
            <div className="flex gap-2.5 items-center bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200/60">
              <span className="text-xs font-semibold text-slate-500 mr-1">Cor:</span>
              {colors.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-slate-900/40 ${
                      isSelected
                        ? 'scale-125 border-slate-950 ring-2 ring-indigo-500 ring-offset-2 shadow-md'
                        : 'hover:scale-110 opacity-90 hover:border-slate-900'
                    }`}
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  />
                );
              })}
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Salvando...' : 'Colar Post-it'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}