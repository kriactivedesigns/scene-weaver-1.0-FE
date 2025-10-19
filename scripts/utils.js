const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Execute a shell command and handle success/error messages
 * @param {string} command - The command to execute
 * @param {string} successMessage - Message to show on success
 * @param {string} errorMessage - Message to show on error
 * @returns {boolean} - True if command succeeded, false otherwise
 */
function executeCommand(command, successMessage, errorMessage) {
  try {
    console.log(chalk.blue(`\n🔄 Executing: ${command}\n`));
    execSync(command, { stdio: 'inherit' });
    if (successMessage) {
      console.log(chalk.green(`\n✅ ${successMessage}\n`));
    }
    return true;
  } catch (error) {
    if (errorMessage) {
      console.error(chalk.red(`\n❌ ${errorMessage}\n`));
    }
    console.error(error);
    return false;
  }
}

/**
 * Ask user for confirmation before deployment
 * @param {string} environment - The environment name (e.g., 'PRODUCTION')
 * @returns {Promise<boolean>} - Resolves to true if user confirms
 */
function confirmDeployment(environment) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question(
      chalk.yellow(`\n⚠️  Are you sure you want to deploy to ${environment}? (y/n): `),
      (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      }
    );
  });
}

module.exports = { executeCommand, confirmDeployment };
