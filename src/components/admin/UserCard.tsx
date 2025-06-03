
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
    <Card className="border-0 shadow-none bg-sidebar">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-sidebar rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
