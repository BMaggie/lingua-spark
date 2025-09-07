import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Heart, 
  Share, 
  BookMarked,
  Globe,
  UserPlus,
  MessageSquare,
  TrendingUp,
  Clock,
  ThumbsUp,
  Reply,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    streak: number;
  };
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline';
  lastSeen: string;
  streak: number;
}

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'achievement' | 'lesson' | 'streak' | 'friend';
  content: string;
  timestamp: string;
}

const CommunityPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('forum');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: {
        name: 'Maria García',
        avatar: '/avatars/maria.jpg',
        level: 23,
        streak: 45
      },
      title: 'Tips for remembering Spanish verb conjugations',
      content: 'I\'ve been struggling with verb conjugations. Here are some techniques that helped me...',
      tags: ['Spanish', 'Grammar', 'Tips'],
      timestamp: '2 hours ago',
      likes: 24,
      replies: 8,
      category: 'Study Tips'
    },
    {
      id: '2',
      author: {
        name: 'John Smith',
        avatar: '/avatars/john.jpg',
        level: 19,
        streak: 32
      },
      title: 'Best Spanish podcasts for beginners?',
      content: 'Looking for podcast recommendations to improve my listening skills...',
      tags: ['Spanish', 'Podcasts', 'Listening'],
      timestamp: '5 hours ago',
      likes: 18,
      replies: 12,
      category: 'Resources'
    }
  ];

  const friends: Friend[] = [
    {
      id: '1',
      name: 'Emma Johnson',
      avatar: '/avatars/emma.jpg',
      level: 17,
      status: 'online',
      lastSeen: 'now',
      streak: 28
    },
    {
      id: '2',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      level: 21,
      status: 'offline',
      lastSeen: '3 hours ago',
      streak: 55
    }
  ];

  const activities: ActivityItem[] = [
    {
      id: '1',
      user: {
        name: 'Emma Johnson',
        avatar: '/avatars/emma.jpg'
      },
      type: 'achievement',
      content: 'unlocked the "Vocabulary Master" achievement',
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      user: {
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg'
      },
      type: 'streak',
      content: 'completed a 50-day learning streak!',
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      user: {
        name: 'Sofia Rodriguez',
        avatar: '/avatars/sofia.jpg'
      },
      type: 'lesson',
      content: 'completed the "Advanced Grammar" lesson',
      timestamp: '5 hours ago'
    }
  ];

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community.",
    });
    
    setNewPostTitle('');
    setNewPostContent('');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'lesson': return <BookMarked className="h-4 w-4 text-blue-500" />;
      case 'streak': return <Clock className="h-4 w-4 text-red-500" />;
      case 'friend': return <UserPlus className="h-4 w-4 text-green-500" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect, learn, and grow together</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-muted-foreground">Active Learners</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">3,456</p>
                  <p className="text-xs text-muted-foreground">Forum Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-muted-foreground">Languages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Your Friends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Friends & Activity */}
          <div className="lg:col-span-1 space-y-6">
            {/* Friends List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Friends ({friends.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Level {friend.level} • {friend.streak} day streak
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {getActivityIcon(activity.type)}
                        <p className="text-xs">
                          <span className="font-medium">{activity.user.name}</span>{' '}
                          {activity.content}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
                <TabsTrigger value="chat">Study Groups</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="forum" className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle>Share with the Community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="What's your question or tip?"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Share your thoughts, ask questions, or give advice..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="secondary">Spanish</Badge>
                        <Badge variant="outline">Question</Badge>
                      </div>
                      <Button onClick={handleCreatePost}>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Forum Posts */}
                <div className="space-y-4">
                  {forumPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Post Header */}
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{post.author.name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    Level {post.author.level}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                              </div>
                              <Badge>{post.category}</Badge>
                            </div>

                            {/* Post Content */}
                            <div>
                              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                              <p className="text-muted-foreground">{post.content}</p>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Reply className="h-4 w-4 mr-1" />
                                  {post.replies}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share className="h-4 w-4 mr-1" />
                                  Share
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm">
                                <BookMarked className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chat">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Study Groups</h3>
                      <p className="text-muted-foreground mb-4">
                        Join study groups to practice with other learners
                      </p>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join a Study Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Community Events</h3>
                      <p className="text-muted-foreground mb-4">
                        Participate in language challenges and community events
                      </p>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        View Upcoming Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;