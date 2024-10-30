
// src/commands/stopMonitoringService.ts
import * as vscode from 'vscode';

declare let monitoringProcess: any; // 添加这一行

export function stopMonitoringService() {
    if (monitoringProcess) {
        monitoringProcess.kill();
        monitoringProcess = undefined;
        vscode.window.showInformationMessage("Monitoring service stopped.");
    } else {
        vscode.window.showInformationMessage("Monitoring service is not running.");
    }
}