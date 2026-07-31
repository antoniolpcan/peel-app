import { useCallback, useEffect, useState } from 'react';
import { followService } from '@/services/followService';
import type { FollowerResponse, FollowingResponse, FollowStatsResponse } from '@/services/types';

export function useFollowers(userId: number) {
  const [followers, setFollowers] = useState<FollowerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = useCallback(async () => {
    if (!userId) return;
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

  return { followers, loading, error, refetch: fetchFollowers };
}

export function useFollowStats(userId: number) {
  const [stats, setStats] = useState<FollowStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
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

  return { stats, loading, error, refetch: fetchStats };
}

export function useFollowing(userId: number) {
  const [following, setFollowing] = useState<FollowingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = useCallback(async () => {
    if (!userId) return;
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

  return { following, loading, error, refetch: fetchFollowing };
}