// utils/statusBar.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';
import { parseNodeUsage, parseGpuUsage } from './parseOutput';

let monitoringInterval: NodeJS.Timeout | undefined;  // 定时器
const nodeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

export function initializeStatusBar(context: vscode.ExtensionContext) {
    nodeStatusBarItem.tooltip = "Node usage for short-a, regular-a, and share-interactive";
    nodeStatusBarItem.show();
    context.subscriptions.push(nodeStatusBarItem);

    // 默认启动监测
    startMonitoring();
}

// 启动监测
export function startMonitoring() {
    if (monitoringInterval) {
        vscode.window.showInformationMessage("Resource monitoring is already running.");
        return;
    }

    // 每 10 秒更新一次状态栏信息
    monitoringInterval = setInterval(updateNodeStatus, 10000);
    updateNodeStatus();  // 初次调用
    vscode.window.showInformationMessage("Resource monitoring started.");
}

// 停止监测
export function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = undefined;
        nodeStatusBarItem.text = '';  // 清除状态栏文本
        vscode.window.showInformationMessage("Resource monitoring stopped.");
    } else {
        vscode.window.showInformationMessage("Resource monitoring is not running.");
    }
}

// 更新状态栏信息
function updateNodeStatus() {
    exec('pjstat --nodeuse', (error, stdout, stderr) => {
        if (error) {
            nodeStatusBarItem.text = `$(alert) Error fetching node info`;
            console.error(`Error executing pjstat: ${error.message}`);
            return;
        }

        const nodeInfo = parseNodeUsage(stdout);
        nodeStatusBarItem.text = `$(server) short-a: ${nodeInfo['short-a'] || 'N/A'} | regular-a: ${nodeInfo['regular-a'] || 'N/A'}`;
    });

    exec('pjstat --gpuuse', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing pjstat --gpuuse: ${error.message}`);
            return;
        }

        const gpuInfo = parseGpuUsage(stdout);
        nodeStatusBarItem.text += ` | share-interactive: ${gpuInfo['share-interactive'] || 'N/A'}`;
    });
}
