import { Routes, Route} from 'react-router-dom';
import { Feed } from '../pages/Feed';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Profile } from '../pages/Profile';
import { PrivateRoute } from './PrivateRoute';
import { NotificationsPage } from '@/pages/Notifications';
import { ChatPage } from '@/pages/Chat';
import { UserSettingsPage } from '@/pages/UserSettings';
import { ResetPasswordPage } from '@/pages/ResetPassword';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/perfil/:id" element={<Profile />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/settings" element={<UserSettingsPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}