import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import type { BasicUserResponse, UserCreate, UserResponse, UserUpdate } from '@/services/types';
import { parseApiError } from '@/utils/errorParser';

export function useUsers(skip = 0, limit = 100) {
  const [users, setUsers] = useState<BasicUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    let isMounted = true;
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(skip, limit);
      if (isMounted) setUsers(data);
    } catch (err: unknown) {
      if (isMounted) setError(parseApiError(err) || 'Erro ao carregar usuários.');
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => { isMounted = false; };
  }, [skip, limit]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getUsers(skip, limit);
        if (isMounted) setUsers(data);
      } catch (err: unknown) {
        if (isMounted) setError(parseApiError(err) || 'Erro ao carregar usuários.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [skip, limit]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(userId: number) {
  const [user, setUser] = useState<BasicUserResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(userId);
      if (isMounted) setUser(data);
    } catch (err: unknown) {
      if (isMounted) setError(parseApiError(err) || 'Erro ao carregar dados do usuário.');
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => { isMounted = false; };
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await userService.getUserById(userId);
        if (isMounted) setUser(data);
      } catch (err: unknown) {
        if (isMounted) setError(parseApiError(err) || 'Erro ao carregar dados do usuário.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserActions() {
  const [loading, setLoading] = useState(false);
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