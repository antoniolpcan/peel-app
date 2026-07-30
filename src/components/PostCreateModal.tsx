import { useState } from 'react';
import { usePosts } from '../hooks/usePosts';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { handleSubmit, isLoading } = usePosts();

  const onSubmit = () => {
    handleSubmit(title, body, {
      onSuccess: () => onSuccess(),
      onClose: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#E2E4E9] rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl flex flex-col min-h-112.5">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>

        <input 
          type="text"
          placeholder="Digite aqui..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent outline-none placeholder:text-slate-800 mb-2"
        />
        
        <textarea 
          placeholder="Escreva sua nota aqui..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full grow bg-transparent outline-none resize-none placeholder:text-gray-400 text-slate-700 text-lg mt-2"
        />

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300/50">
          <span className="text-xs text-gray-400">Peel</span>
          <button 
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </div>
    </div>
  );
}