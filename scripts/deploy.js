const { execSync } = require('child_process');

try {
  console.log('Deploying the project...');
  // Add your deployment commands here
  // Example: execSync('scp -r dist/ user@server:/path/to/deploy', { stdio: 'inherit' });
  console.log('Deployment completed successfully.');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
