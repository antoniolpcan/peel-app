import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CommentFormProps {
  onSubmitComment: (content: string) => Promise<boolean>;
}

export function CommentForm({ onSubmitComment }: CommentFormProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmitComment(newComment);
    if (success) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Adicione um comentário..."
        className="grow py-2.5 text-sm"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Enviando..."
        disabled={!newComment.trim()}
        className="px-5 py-2.5 text-sm mt-0 shadow-xs"
      >
        Enviar
      </Button>
    </form>
  );
}