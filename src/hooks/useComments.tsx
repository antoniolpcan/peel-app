import { useCallback, useState } from "react";
import type { CommentResponse } from "../api/types";
import { api } from "../api/client";

export function useComments(postId: number) {

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getComments(postId);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    const addComment = async (commentText: string, onSuccess?: () => void) => {
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            await api.createComment(postId, commentText);
            await fetchComments();
            onSuccess?.();
        } catch (error) {
            alert('Erro ao enviar comentário. Você está logada?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        comments,
        isLoading,
        isSubmitting,
        fetchComments,
        addComment
    };
}