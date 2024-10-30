// src/commands/startMonitoringService.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';

let monitoringProcess: any;

export function startMonitoringService() {
    if (monitoringProcess) {
        vscode.window.showInformationMessage("Monitoring service is already running.");
        return;
    }

    monitoringProcess = exec('python backend/install_and_run.py', (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Failed to start monitoring service: ${error.message}`);
            return;
        }
        vscode.window.showInformationMessage("Monitoring service started.");
    });
}

