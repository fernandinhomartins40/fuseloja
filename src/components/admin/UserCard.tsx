
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
    <Card className="border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-12 relative">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        <div className="p-4 -mt-6 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 border-4 border-white shadow-lg ring-2 ring-indigo-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator with glow */}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-3 border-white rounded-full shadow-lg">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user.name}
                </p>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 py-0.5 rounded-full border-0">
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-slate-600 truncate font-medium">
                {user.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-emerald-600 font-semibold">Online agora</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
