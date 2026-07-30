import { useCallback, useState } from 'react';
import type { UserData } from '../api/types';
import { api } from '../api/client';

export function useUser() {
    const [user, setUser] = useState<UserData | null>(null);

    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [error, setError] = useState<Error | null>(null);

    const fetchUser = useCallback(async (userId: number) => {
        setIsFetching(true);
        try {
            const data = await api.getUser(userId);
            setUser(data);
        } catch (err) {
            console.error(err);
            setError(err as Error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    const updateUser = async (
        formData: Partial<UserData>,
        options?: { onSuccess?: () => void; onError?: () => void }
    ) => {
        setIsUpdating(true);
        try {
            const updatedUser = await api.updateMe(formData);
            setUser(updatedUser);
            options?.onSuccess?.();
        } catch (error) {
            console.error(error);
            options?.onError?.();
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        user,
        isFetching, 
        isUpdating,
        error,
        fetchUser,
        updateUser
    };
}