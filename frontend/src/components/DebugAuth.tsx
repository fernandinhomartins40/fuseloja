import { useAuth } from '@/hooks/useAuth';

const DebugAuth = () => {
  const { user, apiUser, isAuthenticated, isLoading } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Não mostrar em produção
  }

  // Check localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const storedUser = localStorage.getItem('user');

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <div className="space-y-1">
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
        <p>user: {user ? user.name : 'null'}</p>
        <p>apiUser: {apiUser ? `${apiUser.firstName} ${apiUser.lastName}` : 'null'}</p>
        <p>role: {apiUser?.role || 'none'}</p>
        <hr className="my-2" />
        <h4 className="font-bold">LocalStorage:</h4>
        <p>accessToken: {accessToken ? `${accessToken.substring(0, 20)}...` : 'null'}</p>
        <p>refreshToken: {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'}</p>
        <p>storedUser: {storedUser ? JSON.parse(storedUser).email : 'null'}</p>
      </div>
    </div>
  );
};

export default DebugAuth; 