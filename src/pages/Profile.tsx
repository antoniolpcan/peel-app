import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, SearchX } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUsers';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { useProfileFollow } from '@/hooks/useProfileFollow';
import { useFollowing } from '@/hooks/useFollows';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostPinboard } from '@/components/posts/PostPinboard';
import { PostModalsManager } from '@/components/posts/PostModalsManager';

import { ImageCropModal } from '@/components/ui/ImageCropModal';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { FollowListModal } from '@/components/profile/FollowListModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { PinboardHeader } from '@/components/posts/PinboardHeader';
import type { BasicUserResponse } from '@/services/types';

export function Profile() {
  const { loggedUserId, isAuthenticated } = useAuth();
  const { id: paramId } = useParams();

  const profileUserId = paramId ? String(paramId) : (loggedUserId || null);
  const isOwnProfile = Boolean(loggedUserId && profileUserId === loggedUserId);

  const { user, loading: isFetching, refetch: refetchUser } = useUser(profileUserId);
  const { colors } = useColors();

  const { following: myFollowing, refetchFollowing: refetchMyFollowing } = useFollowing(loggedUserId);

  const { 
    posts, 
    selectedPost, 
    setSelectedPost, 
    loading: isPostsLoading,
    hasMore,
    fetchMorePosts,
    refetch: fetchPosts, 
    handleLike, 
    handleDelete 
  } = usePosts({
    user_id: profileUserId || undefined,
  });

  const follow = useProfileFollow(profileUserId || "", loggedUserId, isOwnProfile, user?.name);
  const edit = useProfileEdit(user, refetchUser);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const handleOpenCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const handleCloseCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const handleSuccessCreateModal = useCallback(() => {
    fetchPosts();
    follow.refetchStats();
  }, [fetchPosts, follow]);

  const handleCloseViewModal = useCallback(() => {
    setSelectedPost(null);
  }, [setSelectedPost]);

  const handleCloseFollowModal = useCallback(() => {
    follow.setFollowModalType(null);
  }, [follow]);

  const handleCloseCropModal = useCallback(() => {
    edit.setTempImageSrc(null);
  }, [edit]);

  const handleModalFollowToggle = useCallback((toggledUserId: string) => {
    follow.refetchStats();
    
    if (refetchMyFollowing) {
      refetchMyFollowing();
    }
    
    if (toggledUserId === profileUserId) {
      follow.refetchFollowers();
    }
  }, [follow, refetchMyFollowing, profileUserId]);

  const filteredPosts = useMemo(() => {
    if (selectedColorId === null) return posts;
    return posts.filter((post) => post.color_id === selectedColorId);
  }, [posts, selectedColorId]);

  const currentFollowUsers = useMemo((): BasicUserResponse[] => {
    if (follow.followModalType === 'followers') {
      return (follow.followers || [])
        .map((f) => f.follower)
        .filter((u): u is BasicUserResponse => Boolean(u));
    }
    if (follow.followModalType === 'following') {
      return (follow.following || [])
        .map((f) => f.following)
        .filter((u): u is BasicUserResponse => Boolean(u));
    }
    return [];
  }, [follow.followModalType, follow.followers, follow.following]);

  if (isFetching) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-app-muted font-medium">
          <Loader2 className="w-8 h-8 animate-spin text-app-accent mb-2" />
          <p>Carregando perfil...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-app-muted gap-2 text-center">
          <SearchX className="w-10 h-10 text-app-muted/60" />
          <p className="text-lg font-semibold text-app-text">Usuário não encontrado.</p>
          <p className="text-xs text-app-muted">O perfil que você tentou acessar não existe ou foi removido.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onOpenCreateModal={handleOpenCreateModal}>
      <div className="bg-app-card rounded-3xl p-6 sm:p-8 border border-app-border shadow-xs mb-8 transition-colors">
        <ProfileHeader
          user={user}
          stats={follow.stats}
          isOwnProfile={isOwnProfile}
          isEditing={edit.isEditing}
          isAuthenticated={isAuthenticated}
          isFollowingState={follow.isFollowingState}
          isFollowLoading={follow.isFollowLoading}
          onEditClick={edit.startEditing}
          onToggleFollow={follow.handleToggleFollow}
          onOpenFollowers={follow.openFollowersModal}
          onOpenFollowing={follow.openFollowingModal}
        />

        {isOwnProfile && edit.isEditing ? (
          <ProfileEditForm
            editForm={edit.editForm}
            setEditForm={edit.setEditForm}
            avatarPreview={edit.avatarPreview}
            isUploadingImage={edit.isUploadingImage}
            isUpdating={edit.isUpdating}
            onFileChange={edit.handleFileChange}
            onSubmit={edit.handleUpdate}
            onCancel={edit.cancelEditing}
          />
        ) : (
          <div className="border-t border-app-border pt-6 transition-colors">
            <h3 className="text-lg font-bold text-app-text mb-2">Sobre mim</h3>
            <p className="text-app-muted whitespace-pre-wrap text-sm leading-relaxed">
              {user.bio || 'Nenhuma bio cadastrada ainda.'}
            </p>
          </div>
        )}
      </div>

      <section className="flex flex-col gap-8">
        <PinboardHeader title={`Mural de ${user.name}`}>
          <ColorFilter 
            colors={colors} 
            selectedColorId={selectedColorId} 
            onSelectColor={setSelectedColorId} 
          />
        </PinboardHeader>

        <PostPinboard
          posts={filteredPosts}
          loading={isPostsLoading}
          hasMore={hasMore}
          hasActiveFilters={selectedColorId !== null}
          emptyMessage={
            isOwnProfile
              ? 'Você ainda não colou nenhum post-it.'
              : `${user.name} ainda não publicou nenhum post-it.`
          }
          endOfListMessage={`Você viu todos os post-its de ${user.name}!`}
          onFetchMore={fetchMorePosts}
          onLike={handleLike}
          onDelete={handleDelete}
          onSelectPost={setSelectedPost}
        />
      </section>

      <PostModalsManager
        isCreateOpen={isCreateModalOpen}
        onCloseCreate={handleCloseCreateModal}
        onSuccessCreate={handleSuccessCreateModal}
        selectedPost={selectedPost}
        onCloseView={handleCloseViewModal}
        onLikePost={handleLike}
      />

      <FollowListModal
        type={follow.followModalType}
        loading={follow.followModalType === 'followers' ? follow.loadingFollowers : follow.loadingFollowing}
        users={currentFollowUsers}
        myFollowingList={myFollowing}
        onClose={handleCloseFollowModal}
        onToggleFollow={handleModalFollowToggle}
        isOwnProfile={isOwnProfile}
      />

      {edit.tempImageSrc && (
        <ImageCropModal
          imageSrc={edit.tempImageSrc}
          onClose={handleCloseCropModal}
          onCropComplete={edit.handleCropComplete}
        />
      )}
    </PageLayout>
  );
}