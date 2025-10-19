const { executeCommand, confirmDeployment } = require('./utils');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

async function deployProduction() {
  console.log(chalk.cyan('\n🚀 Starting Production Deployment Process...\n'));
  
  // Confirm deployment
  const confirmed = await confirmDeployment('PRODUCTION');
  if (!confirmed) {
    console.log(chalk.yellow('\n❌ Deployment cancelled.\n'));
    process.exit(0);
  }

  // Read version from version.json
  const versionPath = path.join(__dirname, '..', 'version.json');
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  const version = versionData.version;

  // Get current date and time in mm/dd/yyyy HH:mm format (24-hour)
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const date = `${month}/${day}/${year}`;

  // Create release message
  const releaseMessage = `Local - version-${version} ${date}`;

  console.log(chalk.blue(`\n📦 Release: ${releaseMessage}\n`));

  // Select Firebase project
  console.log(chalk.blue('\n📦 Selecting Firebase project...\n'));
  if (!executeCommand('firebase use sceneweaver-1', 'Project selected', 'Failed to select project')) {
    process.exit(1);
  }

  // Check Firebase authentication
  console.log(chalk.blue('\n🔐 Verifying Firebase authentication...\n'));
  if (!executeCommand('firebase projects:list', 'Authentication verified', 'Authentication failed')) {
    process.exit(1);
  }

  // Deploy to production target with message
  const deploySuccess = executeCommand(
    `firebase deploy --only hosting:production -m "${releaseMessage}"`,
    '✅ Successfully deployed to production!',
    '❌ Production deployment failed'
  );

  if (deploySuccess) {
    console.log(chalk.green.bold('\n🎉 Production deployment complete!\n'));
    console.log(chalk.cyan('🌐 Your app is live at: https://sceneweaver.causalsyntax.com\n'));
    console.log(chalk.yellow(`📝 Release: ${releaseMessage}\n`));
  } else {
    process.exit(1);
  }
}

deployProduction();
