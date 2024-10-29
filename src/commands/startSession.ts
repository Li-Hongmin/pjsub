import * as vscode from 'vscode';

export function startInteractiveSession() {
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Interactive Session Terminal');
    terminal.show();
    terminal.sendText(`pjsub --interact -g gg53 -L rscgrp=interactive-a,node=1`);
    vscode.window.showInformationMessage("Starting interactive session...");
}
