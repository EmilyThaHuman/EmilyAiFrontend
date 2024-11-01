const { execSync } = require('child_process');

try {
  console.log('Building the project...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
