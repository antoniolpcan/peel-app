import { useCallback, useEffect, useState } from 'react';
import { followService } from '@/services/followService';
import type { FollowerResponse, FollowingResponse, FollowStatsResponse } from '@/services/types';

export function useFollowers(userId: number | null | undefined, skip = 0, limit = 50) {
  const [followers, setFollowers] = useState<FollowerResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = useCallback(async () => {
    if (!userId) {
      setFollowers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowers(userId, skip, limit);
      setFollowers((prev) => (skip === 0 ? data : [...prev, ...data]));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar seguidores.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, skip, limit]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return { 
    followers, 
    loading, 
    error, 
    refetch: fetchFollowers,
    refetchFollowers: fetchFollowers
  };
}

export function useFollowStats(userId: number | null | undefined) {
  const [stats, setStats] = useState<FollowStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowStats(userId);
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar estatísticas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchStats,
    refetchStats: fetchStats
  };
}

export function useFollowing(userId: number | null | undefined, skip = 0, limit = 50) {
  const [following, setFollowing] = useState<FollowingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = useCallback(async () => {
    if (!userId) {
      setFollowing([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowing(userId, skip, limit);
      setFollowing((prev) => (skip === 0 ? data : [...prev, ...data]));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar usuários seguidos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, skip, limit]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  return { 
    following, 
    loading, 
    error, 
    refetch: fetchFollowing,
    refetchFollowing: fetchFollowing
  };
}

export function useFollowActions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const followUser = useCallback(async (userId: number): Promise<FollowerResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      return await followService.followUser({ following_id: userId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao seguir usuário.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await followService.unfollowUser(userId);
      return success ?? true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao deixar de seguir usuário.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { followUser, unfollowUser, loading, error };
}