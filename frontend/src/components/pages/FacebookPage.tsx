import { FaFacebook, FaLink, FaUnlink } from 'react-icons/fa';

interface FacebookPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const FacebookPage = ({ isConnected, onConnect, onDisconnect }: FacebookPageProps) => {
  return (
    <div className="p-6 md:p-8">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <FaFacebook className="text-blue-600 text-6xl mb-2" />
          <h2 className="text-2xl font-bold text-center">Connect to Facebook</h2>
          <p className="text-gray-500 text-center max-w-md">
            Connect your Facebook account to analyze profiles, posts, and get AI-powered insights
          </p>
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
          >
            <FaLink className="text-sm" /> Connect Facebook
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Facebook Analysis</h1>
              <p className="text-gray-500">Analyze Facebook profiles and posts</p>
            </div>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaUnlink className="text-sm" /> Disconnect
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FaFacebook className="text-blue-600 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Coming Soon!</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Facebook integration is currently under development. Check back soon for updates!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookPage; 