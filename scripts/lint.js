const { execSync } = require('child_process');

try {
  console.log('Running ESLint...');
  execSync('eslint . --ext .js,.jsx,.ts,.tsx', { stdio: 'inherit' });
  console.log('Linting completed successfully.');
} catch (error) {
  console.error('Linting failed:', error);
  process.exit(1);
}
