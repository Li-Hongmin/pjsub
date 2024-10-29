import * as vscode from 'vscode';
import { exec } from 'child_process';

let taskCountStatusBarItem: vscode.StatusBarItem | undefined;
let taskMonitorInterval: NodeJS.Timeout | undefined;

function startTaskMonitor() {
    if (!taskCountStatusBarItem) {
        taskCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        taskCountStatusBarItem.show();
    }

    taskMonitorInterval = setInterval(() => {
        exec("pjstat", (error: Error | null, stdout: string) => {
            if (error) {
                taskCountStatusBarItem!.text = "Tasks: Error";
                return;
            }

            const taskCount = parseTaskCount(stdout);
            taskCountStatusBarItem!.text = `Tasks: ${taskCount}`;
        });
    }, 5000);
}

function stopTaskMonitor() {
    if (taskMonitorInterval) {
        clearInterval(taskMonitorInterval);
        taskMonitorInterval = undefined;
    }

    if (taskCountStatusBarItem) {
        taskCountStatusBarItem.dispose();
        taskCountStatusBarItem = undefined;
    }
}

function parseTaskCount(output: string): number {
    const taskLines = output.split("\n").filter((line: string) => /^\d+/.test(line.trim()));
    return taskLines.length;
}

export {
    startTaskMonitor,
    stopTaskMonitor
};
