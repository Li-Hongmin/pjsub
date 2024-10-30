import * as vscode from 'vscode';
import { getPjstatNodeGpuInfo } from './pjstatNodeGpuParser';
import { getPjstatInfo, PjstatInfo, TaskInfo } from './pjstatParser';

let monitoringInterval: NodeJS.Timeout | undefined;  // 定时器
const nodeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
let taskCountStatusBarItem: vscode.StatusBarItem | undefined;
let taskMonitorInterval: NodeJS.Timeout | undefined;
let currentTaskIndex = 0;
const serverStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
const startIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
const endIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

export function initializeStatusBar(context: vscode.ExtensionContext) {
    startIcon.text = '$(chevron-left)';
    startIcon.show();
    context.subscriptions.push(startIcon);

    nodeStatusBarItem.tooltip = "Node usage for short-a, regular-a, and share-interactive";
    nodeStatusBarItem.show();
    context.subscriptions.push(nodeStatusBarItem);

    serverStatusBarItem.tooltip = "Server stop time and remaining time";
    serverStatusBarItem.show();
    context.subscriptions.push(serverStatusBarItem);

    endIcon.text = '$(chevron-right)';
    endIcon.show();
    context.subscriptions.push(endIcon);

    // 默认启动监测
    startMonitoring();
    startTaskMonitor();
}

// 启动监测
function startMonitoring() {
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
function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = undefined;
        nodeStatusBarItem.text = '';  // 清除状态栏文本
        serverStatusBarItem.text = ''; // 清除服务器状态栏文本
        vscode.window.showInformationMessage("Resource monitoring stopped.");
    } else {
        vscode.window.showInformationMessage("Resource monitoring is not running.");
    }
}

// 更新状态栏信息
async function updateNodeStatus() {
    try {
        const systemInfo = await getPjstatNodeGpuInfo('--nodeuse');
        const aquariusSystem = systemInfo.find(system => system.system === 'Aquarius');
        if (aquariusSystem) {
            const shortA = aquariusSystem.resourceGroups.find(group => group.name.includes('short-a'));
            const regularA = aquariusSystem.resourceGroups.find(group => group.name.includes('regular-a'));
            if (shortA && regularA) {
                nodeStatusBarItem.text = `$(zap) short-a: ${shortA.used}/${shortA.total}  |  $(desktop-download) regular-a: ${regularA.used}/${regularA.total}`;
            } else {
                nodeStatusBarItem.text = '$(alert) short-a or regular-a not found';
            }
        } else {
            nodeStatusBarItem.text = '$(alert) Aquarius system not found';
        }

        const pjstatInfo: PjstatInfo = await getPjstatInfo();
        const remainParts = pjstatInfo.remain.split(' ');
        const days = parseInt(remainParts[0], 10);
        const time = remainParts[1].slice(0, 5); // 只显示小时和分钟
        const stopTime = pjstatInfo.scheduledStopTime.split(' ').slice(0, 2).join(' '); // 显示日期和小时

        serverStatusBarItem.text = `$(clock) Stop: ${stopTime} | Remain: ${days}D ${time}`;
    } catch (error) {
        nodeStatusBarItem.text = `$(error) Error: ${error}`;
        serverStatusBarItem.text = `$(error) Error: ${error}`;
    }
}

// 启动任务监测
function startTaskMonitor() {
    if (!taskCountStatusBarItem) {
        taskCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        taskCountStatusBarItem.tooltip = "Task monitor";
        taskCountStatusBarItem.show();
    }

    taskMonitorInterval = setInterval(async () => {
        try {
            const pjstatInfo: PjstatInfo = await getPjstatInfo();
            const taskCount = pjstatInfo.tasks.length;
            if (taskCount > 0) {
                const task: TaskInfo = pjstatInfo.tasks[currentTaskIndex];
                taskCountStatusBarItem!.text = `$(tasklist) ${currentTaskIndex + 1}/${taskCount} ${task.jobName} ${task.status} | Elapse: ${task.elapse}`;
                currentTaskIndex = (currentTaskIndex + 1) % taskCount;
            } else {
                taskCountStatusBarItem!.text = "$(tasklist) Tasks: 0";
            }
        } catch (error) {
            taskCountStatusBarItem!.text = "$(tasklist) Tasks: Error";
        }
    }, 5000);
}

// 停止任务监测
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

export {
    startMonitoring,
    stopMonitoring,
    startTaskMonitor,
    stopTaskMonitor
};
