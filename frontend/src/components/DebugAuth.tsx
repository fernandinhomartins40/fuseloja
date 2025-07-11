import { useAuth } from '@/hooks/useAuth';

const DebugAuth = () => {
  const { user, apiUser, isAuthenticated, isLoading } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Não mostrar em produção
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <div className="space-y-1">
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
        <p>user: {user ? user.name : 'null'}</p>
        <p>apiUser: {apiUser ? `${apiUser.firstName} ${apiUser.lastName}` : 'null'}</p>
        <p>role: {apiUser?.role || 'none'}</p>
      </div>
    </div>
  );
};

export default DebugAuth; 