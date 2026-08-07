import { createContext, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from '@/hooks/useUsers';
import type { BasicUserResponse } from '@/services/types';

interface UserProfileContextData {
  profile: BasicUserResponse | null;
  loading: boolean;
  refetchProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextData>({} as UserProfileContextData);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { loggedUserId } = useAuth();
  const { user, loading, refetch } = useUser(loggedUserId || 0);

  return (
    <UserProfileContext.Provider value={{ profile: user, loading, refetchProfile: refetch }}>
      {children}
    </UserProfileContext.Provider>
  );
}