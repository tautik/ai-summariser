import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>
            Configure how data is fetched and processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Use Mock Data</h3>
              <p className="text-muted-foreground">
                Toggle between mock and real API data
              </p>
            </div>
            <Button
              variant={useMockData ? 'default' : 'outline'}
              onClick={handleMockDataToggle}
            >
              {useMockData ? 'Using Mock Data' : 'Using Real Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage; 