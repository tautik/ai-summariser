import { FaFacebook, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FacebookPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const FacebookPage = ({ isConnected, onConnect, onDisconnect }: FacebookPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaFacebook className="text-[#1877F2]" />
            Facebook Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze Facebook profiles and posts
          </p>
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? (
            <>
              <FaUnlink className="mr-2 h-4 w-4" />
              Disconnect
            </>
          ) : (
            <>
              <FaLink className="mr-2 h-4 w-4" />
              Connect to Facebook
            </>
          )}
        </Button>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected!</CardTitle>
            <CardDescription>
              Connect to Facebook to analyze profiles and posts.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Facebook Analysis</CardTitle>
            <CardDescription>
              This feature is coming soon! Facebook integration is currently under development.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default FacebookPage; 