import { useCallback, useEffect, useState } from 'react';
import { followService } from '@/services/followService';
import type { FollowerResponse, FollowingResponse, FollowStatsResponse } from '@/services/types';

export function useFollowers(userId: number) {
  const [followers, setFollowers] = useState<FollowerResponse[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowers(userId);
      setFollowers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar seguidores');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

export function useFollowStats(userId: number) {
  const [stats, setStats] = useState<FollowStatsResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowStats(userId);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estatísticas');
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

export function useFollowing(userId: number) {
  const [following, setFollowing] = useState<FollowingResponse[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await followService.getFollowing(userId);
      setFollowing(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários seguidos');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
  const [loading, setLoading] = useState(false);

  const followUser = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      return await followService.followUser({ following_id: userId });
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      const success = await followService.unfollowUser(userId);
      return success ?? true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { followUser, unfollowUser, loading };
}