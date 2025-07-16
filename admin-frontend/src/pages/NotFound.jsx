import { Link } from 'react-router-dom';
import { Button } from '../components/ui-components';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen admin-gradient flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white/20">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-blue-100 mb-8">
            The admin page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button variant="admin" size="lg" className="mr-4">
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
