const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const directoriesToClean = ['dist', 'build'];

directoriesToClean.forEach((dir) => {
  const fullPath = path.resolve(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${fullPath}...`);
    execSync(`rm -rf ${fullPath}`, { stdio: 'inherit' });
    console.log(`${fullPath} removed.`);
  } else {
    console.log(`${fullPath} does not exist.`);
  }
});
