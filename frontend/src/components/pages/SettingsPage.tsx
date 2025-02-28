import { useState } from 'react';
import { FaCog, FaMoon, FaSun, FaDatabase } from 'react-icons/fa';

const SettingsPage = () => {
  const [useMockData, setUseMockData] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleMockDataToggle = () => {
    setUseMockData(!useMockData);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <FaCog className="text-gray-700" /> Settings
        </h1>
        <p className="text-gray-500">
          Configure your application preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaSun className="text-yellow-500" /> Appearance
          </h2>
          <p className="text-gray-500 mb-5">
            Customize how the application looks and feels
          </p>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Theme</h3>
            <div className="flex gap-3">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  theme === 'light' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <FaSun className="text-sm" /> Light
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <FaMoon className="text-sm" /> Dark
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaDatabase className="text-blue-500" /> Data Sources
          </h2>
          <p className="text-gray-500 mb-5">
            Configure how data is fetched and processed
          </p>
          
          {/* <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Use Mock Data</h3>
              <p className="text-gray-500">
                Toggle between mock and real API data
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                useMockData 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={handleMockDataToggle}
            >
              {useMockData ? 'Using Mock Data' : 'Using Real Data'}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 