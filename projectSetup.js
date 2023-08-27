const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const execute = (command, opts = {}) => {
    try {
        execSync(command, { stdio: ['inherit', 'inherit', 'pipe'], ...opts });
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Error executing command: ${command}`);  // Red
        console.error('\x1b[31m%s\x1b[0m', error.stderr.toString());  // Red, stderr
        process.exit(1);
    }
};


console.log('\x1b[34m%s\x1b[0m', 'Setting up PERC project...');

// Install Node modules
console.log('\x1b[33m%s\x1b[0m', 'Step 1: Installing Workspace Node modules...');
execute('yarn install');

// Create .env within scripts directory in order to use pipenv with a project-specific virtual environment
console.log('\x1b[33m%s\x1b[0m', 'Step 2: Creating or updating .env file...');
const envFilePath = path.join(__dirname, 'scripts', '.env');
fs.writeFileSync(envFilePath, 'PIPENV_VENV_IN_PROJECT=1\n', { flag: 'a' });

// Navigate to the scripts directory and set up the Python environment based on the Pipfile
console.log('\x1b[33m%s\x1b[0m', 'Step 3: Setting up Python environment in ./scripts directory...');
execute('pipenv install', { cwd: path.join(__dirname, 'scripts') });

console.log('\x1b[32m%s\x1b[0m', 'Setup completed successfully.');
console.log('Run \x1b[36m%s\x1b[0m to start the server.', 'yarn dev');
;