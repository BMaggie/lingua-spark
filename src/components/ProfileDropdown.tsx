
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Star, Target, Globe, X, Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  userProgress: {
    wordsLearned: number;
    streak: number;
    points: number;
    level: number;
  };
  languages: {
    base: string;
    target: string;
  };
  onBackToLanding: () => void;
}

const ProfileDropdown = ({ userProgress, languages, onBackToLanding }: ProfileDropdownProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Get the user's profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserData(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    onBackToLanding();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Profile</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowProfileModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-lg">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{userData.name}</h3>
                  <p className="text-gray-600">{userData.email}</p>
                  <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="font-semibold text-lg">{userProgress.points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="font-semibold text-lg">{userProgress.wordsLearned}</div>
                  <div className="text-sm text-gray-600">Words Learned</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="font-semibold text-lg">{userProgress.streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-lg">{userProgress.level}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
              </div>

              {/* Languages Section */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Languages
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Currently Learning:</p>
                    <Badge variant="secondary" className="text-sm">
                      {languages.base} → {languages.target}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Languages Spoken:</p>
                    <div className="flex flex-wrap gap-2">
                      {userData.languagesSpoken.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals Section */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Learning Goals
                </h4>
                <div className="space-y-2">
                  {userData.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
