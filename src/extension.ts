import * as vscode from 'vscode';
import { submitTask } from './commands/submitTask';
import { checkUsage } from './commands/checkUsage';
import { startInteractiveSession } from './commands/startSession';
import { generateShScript } from './commands/generateScript';
import { initializeStatusBar, startMonitoring, stopMonitoring } from './utils/statusBar';
const { startTaskMonitor, stopTaskMonitor } = require("./utils/taskMonitor");


export function activate(context: vscode.ExtensionContext) {
    
    // 注册所有命令
    context.subscriptions.push(
        vscode.commands.registerCommand('pjworker.submitTask', submitTask),
        vscode.commands.registerCommand('pjworker.checkUsage', checkUsage),
        vscode.commands.registerCommand('pjworker.startInteractiveSession', startInteractiveSession),
        vscode.commands.registerCommand('pjworker.generateShScript', () => generateShScript(false)),
        vscode.commands.registerCommand('pjworker.generateAndSubmitScript', () => generateShScript(true)),

        // 注册监控控制命令
        vscode.commands.registerCommand('pjworker.startMonitoring', startMonitoring),
        vscode.commands.registerCommand('pjworker.stopMonitoring', stopMonitoring),
        vscode.commands.registerCommand("pjworker.startTaskMonitor", startTaskMonitor),
        vscode.commands.registerCommand("pjworker.stopTaskMonitor", stopTaskMonitor)
    
    );
    // 激活时自动启动任务监视
    startTaskMonitor();
    // 初始化状态栏并开始监测
    initializeStatusBar(context);

    
}

export function deactivate() {
    // 插件停用时可添加清理逻辑
    stopTaskMonitor();
    stopMonitoring();
}
