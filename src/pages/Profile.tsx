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

  if (isFetching) return <div className="min-h-screen flex items-center justify-center text-gray-500">Carregando...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Usuário não encontrado.</div>;

  return (
    <PageLayout onOpenCreateModal={() => setIsCreateModalOpen(true)}>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
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
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sobre mim</h3>
            <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
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