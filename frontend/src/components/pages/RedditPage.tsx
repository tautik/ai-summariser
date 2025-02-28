import { FaReddit, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RedditPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const RedditPage = ({ isConnected, onConnect, onDisconnect }: RedditPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaReddit className="text-[#FF4500]" />
            Reddit Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze Reddit profiles and posts
          </p>
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? (
            <>
              <FaUnlink className="mr-2" />
              Disconnect
            </>
          ) : (
            <>
              <FaLink className="mr-2" />
              Connect to Reddit
            </>
          )}
        </Button>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected!</CardTitle>
            <CardDescription>
              Connect to Reddit to analyze profiles and posts.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Reddit Analysis</CardTitle>
            <CardDescription>
              This feature is coming soon! Reddit integration is currently under development.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default RedditPage; 