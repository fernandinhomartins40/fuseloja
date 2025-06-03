
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const UserCard: React.FC = () => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-0 shadow-none bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/20 mb-2 hover:shadow-md transition-all duration-300 hover:scale-105 transform">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-gradient-to-r ring-blue-400/30 shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold shadow-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Enhanced online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white rounded-full shadow-lg">
              <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 truncate font-medium">
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
