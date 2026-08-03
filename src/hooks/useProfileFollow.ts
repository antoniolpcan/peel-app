import { useState, useEffect } from 'react';
import { useFollowStats, useFollowers, useFollowing } from '@/hooks/useFollows';
import { useFollowActions } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';

export function useProfileFollow(profileUserId: number, loggedUserId?: number | null, isOwnProfile?: boolean, userName?: string) {
  const { addToast } = useToast();
  const { stats, refetch: refetchStats } = useFollowStats(profileUserId);
  const { followers, loading: loadingFollowers, refetch: fetchFollowers } = useFollowers(profileUserId);
  const { following, loading: loadingFollowing, refetch: fetchFollowing } = useFollowing(profileUserId);
  const { followUser, unfollowUser, loading: isFollowLoading } = useFollowActions();

  const [isFollowingState, setIsFollowingState] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);

  useEffect(() => {
    if (!isOwnProfile && followers) {
      const isAlreadyFollowing = followers.some(
        (f: any) => f.follower_id === loggedUserId || f.follower?.id === loggedUserId
      );
      setIsFollowingState(isAlreadyFollowing);
    }
  }, [followers, loggedUserId, isOwnProfile]);

  const handleToggleFollow = async () => {
    const action = isFollowingState ? unfollowUser : followUser;
    const success = await action(profileUserId);

    if (success) {
      const nextState = !isFollowingState;
      setIsFollowingState(nextState);
      refetchStats();
      fetchFollowers();
      addToast(
        nextState ? `Agora você está seguindo ${userName}!` : `Você deixou de seguir ${userName}`,
        nextState ? 'success' : 'info'
      );
    } else {
      addToast('Erro ao atualizar status de seguidor.', 'error');
    }
  };

  const openFollowersModal = () => {
    setFollowModalType('followers');
    fetchFollowers();
  };

  const openFollowingModal = () => {
    setFollowModalType('following');
    fetchFollowing();
  };

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