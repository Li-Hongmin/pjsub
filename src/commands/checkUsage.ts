import * as vscode from 'vscode';

export function checkUsage() {
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Usage Check Terminal');
    terminal.show();
    terminal.sendText(`pjstat --nodeuse`);
    terminal.sendText(`pjstat --gpuuse`);
    vscode.window.showInformationMessage("Checking machine usage...");
}
