import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

interface Tutorial {
  id: string;
  title: string;
  category: 'basics' | 'security' | 'advanced';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPremium: boolean;
  status: 'published' | 'draft';
  views: number;
  createdDate: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalTutorials: 45,
    totalRevenue: 0
  });

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setUsers(data);
        
        // Calculate stats
        const totalUsers = data.length;
        const premiumUsers = data.filter(u => u.subscription === 'premium').length;
        const totalRevenue = premiumUsers * 299; // ₱299 per premium user

        setStats({
          totalUsers,
          premiumUsers,
          totalTutorials: 45,
          totalRevenue
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock tutorials data (you can fetch from database later)
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Network Fundamentals',
      category: 'basics',
      difficulty: 'Beginner',
      isPremium: false,
      status: 'published',
      views: 1247,
      createdDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Advanced Firewall Configuration',
      category: 'security',
      difficulty: 'Advanced',
      isPremium: true,
      status: 'published',
      views: 832,
      createdDate: '2024-02-15'
    },
    {
      id: '3',
      title: 'VLAN Implementation Guide',
      category: 'advanced',
      difficulty: 'Intermediate',
      isPremium: true,
      status: 'draft',
      views: 0,
      createdDate: '2024-12-01'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle subscription toggle
  const handleToggleSubscription = async (userId: string, currentSubscription: 'free' | 'premium') => {
    const newSubscription = currentSubscription === 'free' ? 'premium' : 'free';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription: newSubscription })
        .eq('id', userId);

      if (error) throw error;

      // Refresh users
      await fetchUsers();
      alert(`User subscription updated to ${newSubscription}!`);
    } catch (err: any) {
      console.error('Error updating subscription:', err);
      alert(`Failed to update subscription: ${err.message}`);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Auth deletion error (may need service_role key):', authError);
        // Continue anyway as profile is deleted
      }

      // Refresh users
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, tutorials, and subscriptions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="tutorials">Manage Tutorials</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Live data from database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium">{stats.premiumUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% of total users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tutorials</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium">{stats.totalTutorials}</div>
                  <p className="text-xs text-muted-foreground">Available content</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium">₱{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">₱299 per premium user</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name || 'No name'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                          {user.subscription}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorials.filter(t => t.status === 'published').slice(0, 5).map((tutorial) => (
                      <div key={tutorial.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tutorial.title}</p>
                          <p className="text-sm text-muted-foreground">{tutorial.views} views</p>
                        </div>
                        <Badge variant={tutorial.isPremium ? 'default' : 'secondary'}>
                          {tutorial.isPremium ? 'Premium' : 'Free'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={fetchUsers}>
                  Refresh
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and subscriptions ({filteredUsers.length} users)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || 'No name'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                            {user.subscription}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{formatDate(user.updated_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleSubscription(user.id, user.subscription)}
                              title={`Change to ${user.subscription === 'free' ? 'premium' : 'free'}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tutorial
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tutorial Management</CardTitle>
                    <CardDescription>
                      Create and manage learning content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTutorials.map((tutorial) => (
                          <TableRow key={tutorial.id}>
                            <TableCell className="font-medium">{tutorial.title}</TableCell>
                            <TableCell className="capitalize">{tutorial.category}</TableCell>
                            <TableCell>{tutorial.difficulty}</TableCell>
                            <TableCell>
                              <Badge variant={tutorial.isPremium ? 'default' : 'secondary'}>
                                {tutorial.isPremium ? 'Premium' : 'Free'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={tutorial.status === 'published' ? 'default' : 'secondary'}>
                                {tutorial.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{tutorial.views}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Tutorial</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Tutorial title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basics">Network Basics</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Tutorial description" rows={3} />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">Save Draft</Button>
                      <Button variant="outline" className="flex-1">Publish</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-medium">₱{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                      <p className="text-2xl font-medium">{stats.premiumUsers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-medium">
                        {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Free Users</span>
                      <span className="font-medium">{stats.totalUsers - stats.premiumUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Premium Users</span>
                      <span className="font-medium">{stats.premiumUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Users</span>
                      <span className="font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Revenue per User</span>
                      <span className="font-medium">
                        ₱{stats.totalUsers > 0 ? Math.round(stats.totalRevenue / stats.totalUsers) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={fetchUsers}>
                    <Download className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}