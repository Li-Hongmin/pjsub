import * as vscode from 'vscode';

// 定义状态栏按钮
let statusBarItem: vscode.StatusBarItem;

// 判断是否为 pjsub 类型的文件
function isPjsubFile(document: vscode.TextDocument): boolean {
    const content = document.getText();
    const hasPjsubOption = content.includes('#------ pjsub option --------#');
    const hasProgramExecution = content.includes('#------- Program execution -------#');
    return hasPjsubOption && hasProgramExecution;
}

// 更新状态栏按钮
function updateStatusBar(document: vscode.TextDocument | undefined) {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'pjworker.submitTask';
    }

    // 判断是否需要显示按钮
    if (document && document.languageId === 'shellscript' && isPjsubFile(document)) {
        statusBarItem.text = `$(rocket) 提交任务`;
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

// 提交任务命令
function submitTask() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("未找到活动文件，请打开 .sh 文件！");
        return;
    }

    const document = editor.document;
    if (document.languageId === 'shellscript' && isPjsubFile(document)) {
        const filePath = document.fileName;
        const fileDir = vscode.workspace.asRelativePath(document.uri.with({ path: document.uri.path.replace(/\/[^/]+$/, '') }));
        
        const terminal = vscode.window.createTerminal('Pjsub Terminal');
        terminal.show();
        terminal.sendText(`cd "${fileDir}" && pjsub "${filePath}"`);
        vscode.window.showInformationMessage(`正在提交任务：pjsub ${filePath}`);
    } else {
        vscode.window.showErrorMessage("该文件不支持 pjsub 提交。");
    }
}

// 插件激活时的初始化
export function activate(context: vscode.ExtensionContext) {
    // 注册提交任务命令
    const submitTaskCommand = vscode.commands.registerCommand('pjworker.submitTask', submitTask);
    context.subscriptions.push(submitTaskCommand);

    // 注册文件切换和打开事件
    vscode.window.onDidChangeActiveTextEditor(editor => {
        updateStatusBar(editor?.document);
    });
    vscode.workspace.onDidOpenTextDocument(updateStatusBar);

    // 初次激活时检测当前活动文件
    if (vscode.window.activeTextEditor) {
        updateStatusBar(vscode.window.activeTextEditor.document);
    }
}

// 停用插件时清理
export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
