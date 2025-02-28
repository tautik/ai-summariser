import { FaEnvelope, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GmailPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const GmailPage = ({ isConnected, onConnect, onDisconnect }: GmailPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaEnvelope className="text-[#D44638]" />
            Gmail Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze your email communications
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
              Connect to Gmail
            </>
          )}
        </Button>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected!</CardTitle>
            <CardDescription>
              Connect to Gmail to analyze your email communications.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Gmail Analysis</CardTitle>
            <CardDescription>
              This feature is coming soon! Gmail integration is currently under development.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default GmailPage; 