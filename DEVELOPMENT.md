# Development Guide

## Project Structure

\`\`\`
pjsub/
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   ├── tasks.json
├── .vscode-test.mjs
├── .vscodeignore
├── backend/
│   ├── install_and_run.py
│   ├── server.py
│   └── utils/
│       └── pjstat_parser.py
├── CHANGELOG.md
├── eslint.config.mjs
├── LICENSE.md
├── media/
│   └── dashboard.js
├── note.md
├── package.json
├── README.md
├── resources/
│   ├── dark/
│   └── light/
├── src/
│   ├── commands/
│   │   ├── checkUsage.ts
│   │   ├── generateScript.ts
│   │   ├── monitorTaskOutput.ts
│   │   └── ...
│   ├── extension.ts
│   ├── test/
│   │   └── extension.test.ts
│   ├── utils/
│   │   └── ...
│   └── webview/
├── tsconfig.json
├── vsc-extension-quickstart.md
└── webpack.config.js
\`\`\`

## Requirements

- Node.js (recommended v14.x or higher)
- npm (comes with Node.js)
- Python 3.x
- VS Code

## Installation Steps

1. **Clone the repository**:

   \`\`\`sh
   git clone <your-repo-url>
   cd pjsub
   \`\`\`

2. **Install Node.js dependencies**:

   \`\`\`sh
   npm install
   \`\`\`

3. **Install Python dependencies**:

   \`\`\`sh
   cd backend
   python install_and_run.py
   cd ..
   \`\`\`

4. **Compile TypeScript code**:

   \`\`\`sh
   npx webpack
   \`\`\`

5. **Open the project in VS Code**:

   Open VS Code and then open the project folder.

6. **Configure VS Code**:

   Ensure the following extensions are installed in VS Code:
   - ESLint
   - Prettier - Code formatter
   - Python

   You can find the recommended extensions in \`.vscode/extensions.json\`.

## Development and Debugging

1. **Start the extension**:

   Press \`F5\` in VS Code to start debugging the extension.

2. **Run tests**:

   \`\`\`sh
   npm test
   \`\`\`

3. **Watch for file changes**:

   \`\`\`sh
   npm run watch
   \`\`\`

## Project Commands

### VS Code Commands

- \`pjworker.showDashboard\`: Show resource monitoring dashboard
- \`pjworker.submitTask\`: Submit a task
- \`pjworker.checkUsage\`: Check machine usage
- \`pjworker.startInteractiveSession\`: Start an interactive session
- \`pjworker.generateShScript\`: Generate PJ Sub script
- \`pjworker.generateAndSubmitScript\`: Generate and submit PJ Sub script
- \`pjworker.startMonitoring\`: Start resource monitoring
- \`pjworker.stopMonitoring\`: Stop resource monitoring
- \`pjworker.startTaskMonitor\`: Start task monitoring
- \`pjworker.stopTaskMonitor\`: Stop task monitoring
- \`pjworker.startMonitoringService\`: Start monitoring service
- \`pjworker.stopMonitoringService\`: Stop monitoring service

### npm Scripts

- \`npm run compile\`: Compile TypeScript code
- \`npm run watch\`: Watch for file changes and automatically compile
- \`npm run lint\`: Run ESLint to check code
- \`npm test\`: Run tests

## FAQ

- **Extension not activated**: Ensure you have opened a workspace and correctly installed the \`.vsix\` file.
- **Task submission error**: Verify the \`.sh\` file syntax is correct and PJ Sub settings are valid.
- **Status check not updating**: Ensure you have access to the \`pjstat\` command and it is correctly configured in your environment.

