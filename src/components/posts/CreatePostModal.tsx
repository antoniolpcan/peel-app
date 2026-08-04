import { useState, useEffect } from 'react';
import { StickyNote, Send, Loader2 } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { usePostActions } from '@/hooks/usePosts';
import { useToast } from '@/contexts/ToastContext';
import { ModalLayout } from '@/components/layout/ModalLayout';
import { ColorPalettePicker } from '@/components/ui/ColorPalettePicker';
import { PostItNote } from '@/components/ui/PostItNote';
import { Button } from '@/components/ui/Button';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const { addToast } = useToast();
  const { colors, loading: isLoadingColors } = useColors();
  const { createPost, loading: isLoading } = usePostActions();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  useEffect(() => {
    if (colors.length > 0 && selectedColorId === null) {
      setSelectedColorId(colors[0].id);
    }
  }, [colors, selectedColorId]);

  const currentColor = colors.find((c) => c.id === selectedColorId) || colors[0];

  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      addToast('Preencha o título e o corpo da nota!', 'info');
      return;
    }

    const created = await createPost({
      title,
      body,
      color_id: currentColor?.id || null,
    });

    if (created) {
      onSuccess();
      onClose();
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="flex flex-col gap-5">
        
        <div className="flex justify-between items-center pb-3 border-b border-app-border transition-colors">
          <h3 className="text-lg font-bold text-app-text flex items-center gap-2 transition-colors">
            <StickyNote className="w-5 h-5 text-app-accent" />
            <span>Criar Novo Post-it</span>
          </h3>
        </div>

        {isLoadingColors && !currentColor ? (
          <div className="min-h-65 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-app-muted" />
          </div>
        ) : (
          <PostItNote hexCode={currentColor?.hex_code} className="min-h-65 flex flex-col shadow-inner">
            <input
              type="text"
              placeholder="Título do Post-it..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent outline-none 
              placeholder:text-slate-700/50 text-slate-800 mb-3"
            />

            <textarea
              placeholder="Escreva sua nota aqui..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full grow bg-transparent outline-none resize-none 
              placeholder:text-slate-700/40 text-slate-800 text-base leading-relaxed"
            />
          </PostItNote>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
          
          <div className="shrink-0">
            <ColorPalettePicker
              colors={colors}
              selectedColorId={currentColor?.id}
              onSelectColor={setSelectedColorId}
            />
          </div>

          <div className="flex items-center gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-app-muted 
              hover:text-app-text rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            
            <Button
              type="button"
              onClick={onSubmit}
              isLoading={isLoading}
              loadingText="Colando..."
              className="px-5 py-2.5 text-sm mt-0 shadow-md inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Colar Post-it</span>
            </Button>
          </div>

        </div>

      </div>
    </ModalLayout>
  );
}