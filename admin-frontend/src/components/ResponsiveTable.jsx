import { useMobile } from '../hooks/use-mobile';
import { Card, CardContent, Button, Badge } from './ui-components';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ResponsiveUserTable = ({ users, onEdit, onDelete, isLoading }) => {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user._id} className="admin-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-admin-100 rounded-full flex items-center justify-center">
                        <span className="text-admin-600 font-medium text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">Active</Badge>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{user.filesCount || 0}</div>
                    <div className="text-gray-600">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{user.analyticsCount || 0}</div>
                    <div className="text-gray-600">Analytics</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">Joined</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user._id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view (existing table code would go here)
  return null;
};
