# PJSub Plugin for VS Code

The **PJSub Plugin** provides an efficient way to submit, monitor, and manage supercomputing tasks directly from VS Code. This plugin is designed for teams and individuals using supercomputing resources, enabling task submission and status checks without leaving the editor.

## Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Features](#features)
4. [Troubleshooting](#troubleshooting)

---

## Installation

### 1. Installing from a VSIX File

1. Obtain the `.vsix` file for the PJSub plugin.
2. Open **VS Code** and go to the **Extensions** panel.
3. Click the ellipsis `⋮` in the top right corner and select **Install from VSIX...**.
4. Select the `.vsix` file to complete the installation.

### 2. Plugin Activation

The plugin will activate automatically when a workspace is opened in VS Code. Once activated, you can use the commands provided by the plugin through the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`).

---

## Configuration

The plugin includes several configuration options that can be adjusted in VS Code **Settings** (`Ctrl+,` or `Cmd+,`) or directly in the `settings.json` file.

### Available Settings

- **pjsub.resourceGroup**: Resource group (default: `"short-a"`)
- **pjsub.nodeCount**: Number of nodes (default: `1`)
- **pjsub.elapsedTime**: Maximum elapsed time (default: `"2:00:00"`)
- **pjsub.projectGroup**: Project group (default: `"gg53"`)
- **pjsub.joinOutput**: Merge output files (default: `true`)

### Example Configuration in `settings.json`

```json
{
    "pjsub.resourceGroup": "short-a",
    "pjsub.nodeCount": 2,
    "pjsub.elapsedTime": "1:30:00",
    "pjsub.projectGroup": "gg53",
    "pjsub.joinOutput": true
}
```

---

## Features

### 1. Submit a Task

**Command**: `[PJ] Submit Task`

**Description**: Submits the currently opened `.sh` file as a supercomputing task. After submission, the plugin will automatically run `pjstat` after 3 seconds to check the task's status.

**How to Use**:
1. Open a `.sh` file in VS Code that contains valid task submission commands.
2. Run the `[PJ] Submit Task` command.
3. Upon successful submission, `pjstat` output will display the task's real-time status in the terminal.

### 2. Generate and Submit a PJ Sub Script

**Command**: `[PJ>Gen & Submit!]`

**Description**: Generates an `.sh` script based on the current Python file and configuration settings, then submits it as a task.

**How to Use**:
1. Open a `.py` file you wish to run on the supercomputer.
2. Run the `[PJ>Gen & Submit!]` command.
3. The plugin will generate the `.sh` script and automatically submit it as a task.

### 3. Generate PJ Sub Script Only

**Command**: `[PJ>Gen!]`

**Description**: Generates an `.sh` script based on the current Python file and configuration settings without submitting it as a task.

**How to Use**:
1. Open a `.py` file.
2. Run the `[PJ>Gen!]` command.
3. The plugin will generate the `.sh` script in the `pjsub_scripts` folder within your project directory.

---

## Troubleshooting

1. **Plugin does not activate**: Ensure you’ve opened a workspace and the `.vsix` file is correctly installed.
2. **Task submission errors**: Confirm that the `.sh` file has the correct syntax and valid PJ Sub settings.
3. **Status check not updating**: Ensure you have access to the `pjstat` command and it’s correctly configured in your environment.

For further assistance, please contact your team administrator or refer to the plugin’s support documentation.

---

Enjoy seamless task management with the PJSub Plugin for VS Code!
```

This `README.md` should be helpful for users to understand installation, configuration, and usage instructions clearly.