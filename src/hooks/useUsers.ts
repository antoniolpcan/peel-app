import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import type { BasicUserResponse, UserCreate, UserResponse, UserUpdate } from '@/services/types';
import { parseApiError } from '@/utils/errorParser';

export function useUsers(skip = 0, limit = 100) {
  const [users, setUsers] = useState<BasicUserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(skip, limit);
      setUsers(data);
    } catch (err: unknown) {
      setError(parseApiError(err) || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, [skip, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(userId: number | null | undefined) {
  const [user, setUser] = useState<BasicUserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(userId);
      setUser(data);
    } catch (err: unknown) {
      setError(parseApiError(err) || 'Erro ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserActions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: UserCreate): Promise<UserResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      return await userService.createUser(data);
    } catch (err: unknown) {
      setError(parseApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMe = useCallback(async (data: UserUpdate): Promise<UserResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      return await userService.updateMe(data);
    } catch (err: unknown) {
      setError(parseApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, updateMe, loading, error };
}