
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
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-gray-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 self-start sm:self-auto">
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
