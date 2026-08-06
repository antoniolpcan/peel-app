import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFollowStats, useFollowers, useFollowing } from '@/hooks/useFollows';
import { useFollowActions } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';

export function useProfileFollow(
  profileUserId: number, 
  loggedUserId?: number | null, 
  isOwnProfile?: boolean, 
  userName?: string
) {
  const { addToast } = useToast();
  const { stats, refetch: refetchStats } = useFollowStats(profileUserId);
  const { followers, loading: loadingFollowers, refetch: fetchFollowers } = useFollowers(profileUserId);
  const { following, loading: loadingFollowing, refetch: fetchFollowing } = useFollowing(profileUserId);
  const { followUser, unfollowUser, loading: isFollowLoading } = useFollowActions();

  const [isFollowingState, setIsFollowingState] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);

  const isAlreadyFollowingOwner = useMemo(() => {
    if (isOwnProfile || !followers || !loggedUserId) return false;
    
    return followers.some(
      (f: any) => f.follower_id === loggedUserId || f.follower?.id === loggedUserId
    );
  }, [followers, loggedUserId, isOwnProfile]);

  useEffect(() => {
    setIsFollowingState(isAlreadyFollowingOwner);
  }, [isAlreadyFollowingOwner]);

  const followingIdsSet = useMemo(() => {
    if (!following) return new Set<number>();
    
    return new Set<number>(
      following.map((f: any) => f.following?.id || f.following_id || f.id)
    );
  }, [following]);

  const handleToggleFollow = useCallback(async (targetId?: number) => {
    const targetUserId = targetId || profileUserId;

    if (!targetUserId || targetUserId === loggedUserId) return;

    const isPageOwner = targetUserId === profileUserId;
    
    const isCurrentlyFollowing = isPageOwner 
      ? isFollowingState 
      : followingIdsSet.has(targetUserId);

    const nextState = !isCurrentlyFollowing;

    if (isPageOwner) {
      setIsFollowingState(nextState);
    }

    const action = isCurrentlyFollowing ? unfollowUser : followUser;
    const success = await action(targetUserId);

    if (success) {
      refetchStats();
      fetchFollowers();
      fetchFollowing();

      const toastMessage = isPageOwner 
        ? (nextState ? `Agora você está seguindo ${userName || 'o usuário'}!` : `Você deixou de seguir ${userName || 'o usuário'}`)
        : (nextState ? 'Usuário seguido com sucesso!' : 'Você deixou de seguir este usuário.');

      addToast(toastMessage, nextState ? 'success' : 'info');
    } else {
      if (isPageOwner) {
        setIsFollowingState(isCurrentlyFollowing);
      }
      addToast('Erro ao atualizar status de seguidor.', 'error');
    }
  }, [
    profileUserId,
    loggedUserId,
    isFollowingState,
    followingIdsSet,
    unfollowUser,
    followUser,
    refetchStats,
    fetchFollowers,
    fetchFollowing,
    userName,
    addToast,
  ]);

  const openFollowersModal = useCallback(() => {
    setFollowModalType('followers');
    fetchFollowers();
  }, [fetchFollowers]);

  const openFollowingModal = useCallback(() => {
    setFollowModalType('following');
    fetchFollowing();
  }, [fetchFollowing]);

  return {
    stats,
    followers,
    following,
    loadingFollowers,
    loadingFollowing,
    isFollowingState,
    isFollowLoading,
    followModalType,
    setFollowModalType,
    handleToggleFollow,
    openFollowersModal,
    openFollowingModal,
    refetchFollowers: fetchFollowers,
    refetchStats,
  };
}