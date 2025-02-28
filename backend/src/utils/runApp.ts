import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Utility script to run the application with different configurations
 * 
 * Usage:
 * ts-node src/utils/runApp.ts [mode]
 * 
 * Modes:
 * - dev: Run the application in development mode (default)
 * - test-api: Run the API tests
 * - mock: Run the application with mock data
 * - real: Run the application with real API data
 */

// Get the mode from command line arguments
const mode = process.argv[2] || 'dev';

// Define the root directory
const rootDir = path.join(__dirname, '..', '..');

// Function to run a command
const runCommand = (command: string, args: string[], cwd: string = rootDir) => {
  console.log(`Running command: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (error) => {
    console.error(`Error running command: ${error.message}`);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    console.log(`Command exited with code ${code}`);
    if (code !== 0) {
      process.exit(code || 1);
    }
  });
  
  return child;
};

// Function to update the useMockData flag in socialDataService.ts
const updateMockDataFlag = (useMock: boolean) => {
  const filePath = path.join(rootDir, 'src', 'services', 'socialDataService.ts');
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the useMockData flag
  content = content.replace(
    /const useMockData = (true|false);/,
    `const useMockData = ${useMock};`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated useMockData flag to ${useMock} in socialDataService.ts`);
};

// Execute based on mode
switch (mode) {
  case 'dev':
    runCommand('npm', ['run', 'dev']);
    break;
  
  case 'test-api':
    runCommand('npm', ['run', 'test-api']);
    break;
  
  case 'mock':
    updateMockDataFlag(true);
    runCommand('npm', ['run', 'dev']);
    break;
  
  case 'real':
    updateMockDataFlag(false);
    runCommand('npm', ['run', 'dev']);
    break;
  
  default:
    console.error(`Unknown mode: ${mode}`);
    console.log('Available modes: dev, test-api, mock, real');
    process.exit(1);
} 