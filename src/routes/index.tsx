import { Routes, Route} from 'react-router-dom';
import { Feed } from '../pages/Feed';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Profile } from '../pages/Profile';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
}