import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from '@/hooks/useUsers';
import type { BasicUserResponse } from '@/services/types';

interface UserProfileContextData {
  profile: BasicUserResponse | null;
  loading: boolean;
  refetchProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextData | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { loggedUserId } = useAuth();

  const { user, loading, refetch } = useUser(loggedUserId);

  const contextValue = useMemo(
    () => ({
      profile: user ?? null,
      loading: loggedUserId ? loading : false,
      refetchProfile: refetch,
    }),
    [user, loading, refetch, loggedUserId]
  );

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile deve ser usado dentro de um UserProfileProvider');
  }
  return context;
}