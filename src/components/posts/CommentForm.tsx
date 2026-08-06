import React, { useState, useCallback, memo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CommentFormProps {
  onSubmitComment: (content: string) => Promise<boolean>;
}

export const CommentForm = memo(function CommentForm({ onSubmitComment }: CommentFormProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();

    if (!trimmedComment || isSubmitting) return;

    let isMounted = true;

    try {
      setIsSubmitting(true);
      const success = await onSubmitComment(trimmedComment);

      if (success && isMounted) {
        setNewComment('');
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }

    return () => { isMounted = false; };
  }, [newComment, isSubmitting, onSubmitComment]);

  const isButtonDisabled = !newComment.trim() || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={newComment}
        onChange={handleInputChange}
        placeholder="Adicione um comentário..."
        className="grow py-2.5 text-sm"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Enviando..."
        disabled={isButtonDisabled}
        className="px-5 py-2.5 text-sm mt-0 shadow-xs"
      >
        Enviar
      </Button>
    </form>
  );
});