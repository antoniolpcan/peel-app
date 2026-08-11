import { Routes, Route } from 'react-router-dom';
import { Feed } from '@/pages/Feed';
import { Profile } from '@/pages/Profile';
import { NotificationsPage } from '@/pages/Notifications';
import { ChatPage } from '@/pages/Chat';
import { UserSettingsPage } from '@/pages/UserSettings';
import { ResetPasswordPage } from '@/pages/ResetPassword';
import { PrivateRoute } from './PrivateRoute';
import { NotFoundPage } from '@/pages/NotFound';
import { AuthPage } from '@/pages/Auth';

export function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Feed />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/perfil/:id" element={<Profile />} />

      <Route 
        path="/perfil" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/chat/:chatId" 
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <UserSettingsPage />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}