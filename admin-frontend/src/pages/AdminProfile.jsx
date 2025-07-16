import { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Button,
  Input,
  Label,
  Separator
} from '../components/ui-components';
import { 
  User, 
  Mail, 
  Lock, 
  Save,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@demo.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Mock save functionality
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // Mock password change
    toast.success('Password changed successfully');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your admin account settings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-admin-600" />
            <span className="text-sm font-medium text-admin-600">Super Admin</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-admin-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-admin-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name}</h3>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="admin" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <Button type="submit" variant="admin" className="w-full">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Admin Stats */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Admin Statistics
            </CardTitle>
            <CardDescription>
              Your activity and management statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-sm text-gray-600">Users Managed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Files Reviewed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">23</div>
                <div className="text-sm text-gray-600">Issues Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminProfile;
