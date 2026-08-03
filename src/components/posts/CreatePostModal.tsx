import { useState } from 'react';
import { useColors } from '@/hooks/useColors';
import { usePostActions } from '@/hooks/usePosts';
import { useToast } from '@/contexts/ToastContext';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { ColorPalettePicker } from '@/components/ui/ColorPalettePicker';
import { PostItNote } from '@/components/ui/PostItNote';
import { Button } from '@/components/ui/Button';

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
    <ModalLayout onClose={onClose} maxWidthClass="max-w-xl">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center pb-2 border-b border-app-border transition-colors">
          <h3 className="text-lg font-bold text-app-text flex items-center gap-2 transition-colors">
            <span>📌</span> Criar Novo Post-it
          </h3>
        </div>

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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <ColorPalettePicker
            colors={colors}
            selectedColorId={selectedColor}
            onSelectColor={setSelectedColor}
          />

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-app-muted 
              hover:text-app-text rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <Button
              type="button"
              onClick={onSubmit}
              isLoading={isLoading}
              loadingText="Salvando..."
              className="px-6 py-2.5 text-sm mt-0 shadow-md"
            >
              Colar Post-it
            </Button>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
}