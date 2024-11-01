const { execSync } = require('child_process');

try {
  console.log('Running tests...');
  execSync('npm test', { stdio: 'inherit' });
  console.log('Tests completed successfully.');
} catch (error) {
  console.error('Tests failed:', error);
  process.exit(1);
}
