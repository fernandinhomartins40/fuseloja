
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

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
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-gray-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                Admin
              </Badge>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-600">Online agora</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
