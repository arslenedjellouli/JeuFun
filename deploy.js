const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the project
  console.log('Building project...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Verify build output
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('Build successful! Files in dist folder:');
    const files = fs.readdirSync(distPath, { recursive: true });
    files.forEach(file => console.log(`  - ${file}`));
  } else {
    throw new Error('Build failed - dist folder not found');
  }
  
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
