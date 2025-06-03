
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
    <Card className="border border-gray-200 bg-white mb-2 hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-11 w-11 border-2 border-gray-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
