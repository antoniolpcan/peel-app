import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUsers';
import { usePosts } from '@/hooks/usePosts';
import { useColors } from '@/hooks/useColors';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { useProfileFollow } from '@/hooks/useProfileFollow';

import { PageLayout } from '@/components/layout/PageLayout';
import { PostItGrid } from '@/components/posts/PostItGrid';
import { PostModalsManager } from '@/components/posts/PostModalsManager';

import { ImageCropModal } from '@/components/ui/ImageCropModal';
import { ColorFilter } from '@/components/ui/ColorFilter';
import { FollowListModal } from '@/components/profile/FollowListModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { PinboardHeader } from '@/components/posts/PinBoardHeader';

export function Profile() {
  const { loggedUserId, isAuthenticated } = useAuth();
  const { id: paramId } = useParams();

  const profileUserId = paramId ? Number(paramId) : (loggedUserId || 0);
  const isOwnProfile = profileUserId === loggedUserId;

  const { user, loading: isFetching, refetch: refetchUser } = useUser(profileUserId);
  const { colors } = useColors();

  const { posts, selectedPost, setSelectedPost, refetch: fetchPosts, handleLike, handleDelete } = usePosts({
    user_id: profileUserId || undefined,
  });

  const follow = useProfileFollow(profileUserId, loggedUserId, isOwnProfile, user?.name);
  const edit = useProfileEdit(user, refetchUser);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  useEffect(() => {
    if (profileUserId) {
      fetchPosts();
      follow.refetchStats();
      follow.refetchFollowers();
    }
  }, [profileUserId]);

  const filteredPosts = posts.filter((post) => selectedColorId === null || post.color_id === selectedColorId);

  if (isFetching) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-app-muted font-medium animate-pulse">
          <span className="text-2xl mb-2">🌿</span>
          <p>Carregando perfil...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-app-muted">
          <p className="text-lg font-semibold">Usuário não encontrado.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onOpenCreateModal={() => setIsCreateModalOpen(true)}>
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
          <ColorFilter colors={colors} selectedColorId={selectedColorId} onSelectColor={setSelectedColorId} />
        </PinboardHeader>

        <PostItGrid posts={filteredPosts} handleLike={handleLike} handleDelete={handleDelete} setSelectedPost={setSelectedPost} />
      </section>

      <PostModalsManager
        isCreateOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        onSuccessCreate={fetchPosts}
        selectedPost={selectedPost}
        onCloseView={() => setSelectedPost(null)}
        onLikePost={handleLike}
      />

      <FollowListModal
        type={follow.followModalType}
        loading={follow.followModalType === 'followers' ? follow.loadingFollowers : follow.loadingFollowing}
        users={(follow.followModalType === 'followers' ? follow.followers : follow.following) as any[]}
        onClose={() => follow.setFollowModalType(null)}
      />

      {edit.tempImageSrc && (
        <ImageCropModal
          imageSrc={edit.tempImageSrc}
          onClose={() => edit.setTempImageSrc(null)}
          onCropComplete={edit.handleCropComplete}
        />
      )}
    </PageLayout>
  );
}