// src/commands/monitorTaskOutput.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const outputChannel = vscode.window.createOutputChannel('Task Output Monitor');
const monitoredFiles: { [key: string]: fs.FSWatcher } = {}; // 存储每个监视器

export function monitorTaskOutput(folderPath: string) {
    outputChannel.show();

    // 监视 pjsub_scripts 文件夹中的 .out 文件
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            vscode.window.showErrorMessage(`Failed to read directory: ${err.message}`);
            return;
        }

        files.filter(file => file.endsWith('.out')).forEach(file => {
            const filePath = path.join(folderPath, file);
            if (!monitoredFiles[filePath]) {
                monitorFile(filePath);
            }
        });
    });
}

function monitorFile(filePath: string) {
    const fileName = path.basename(filePath);
    const watcher = fs.watch(filePath, { encoding: 'utf-8' }, (eventType) => {
        if (eventType === 'change') {
            displayLastLine(filePath);
        }
    });

    monitoredFiles[filePath] = watcher;
}

function displayLastLine(filePath: string) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Failed to read file ${filePath}: ${err.message}`);
            return;
        }

        const lines = data.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        outputChannel.appendLine(`[${path.basename(filePath)}]: ${lastLine}`);
    });
}

export function stopMonitoringAllFiles() {
    for (const filePath in monitoredFiles) {
        monitoredFiles[filePath].close();
        delete monitoredFiles[filePath];
    }
    outputChannel.appendLine("Stopped monitoring all task output files.");
}
