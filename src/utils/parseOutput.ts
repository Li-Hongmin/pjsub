import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export { parseNodeUsage, parseGpuUsage, generateShFileContent, createOrUpdateScript, submitScript };

// 解析 node usage 输出，直接使用百分比
function parseNodeUsage(output: string): { [key: string]: string } {
    const nodeInfo: { [key: string]: string } = {};
    const nodeLines = output.split('\n').filter((line: string) => /short-a|regular-a/.test(line));

    nodeLines.forEach((line: string) => {
        const [resource, , usagePercent] = line.trim().split(/\s+/);

        // 检查 usagePercent 是否以百分号结尾，并存储
        if (usagePercent && usagePercent.endsWith('%')) {
            nodeInfo[resource] = usagePercent;
        } else {
            console.warn(`Usage percent format not recognized in line: "${line}"`);
        }
    });

    return nodeInfo;
}

// 解析 GPU usage 输出，直接使用百分比
function parseGpuUsage(output: string): { [key: string]: string } {
    const gpuInfo: { [key: string]: string } = {};
    const gpuLines = output.split('\n').filter((line: string) => /share-interactive/.test(line));

    gpuLines.forEach((line: string) => {
        const [resource, , usagePercent] = line.trim().split(/\s+/);

        const key = resource.includes('share-interactive') ? 'share-interactive' : resource;

        // 检查 usagePercent 是否以百分号结尾，并存储
        if (usagePercent && usagePercent.endsWith('%')) {
            gpuInfo[key] = usagePercent;
        } else {
            console.warn(`GPU usage percent format not recognized in line: "${line}"`);
        }
    });

    return gpuInfo;
}

// 生成 .sh 文件内容
function generateShFileContent(workspaceFolder: string, pythonFileName: string): string {
    const resourceGroup = vscode.workspace.getConfiguration().get("pjsub.resourceGroup", "default-group");
    const nodeCount = vscode.workspace.getConfiguration().get("pjsub.nodeCount", "1");
    const elapsedTime = vscode.workspace.getConfiguration().get("pjsub.elapsedTime", "2:00:00");
    const projectGroup = vscode.workspace.getConfiguration().get("pjsub.projectGroup", "default-project");
    const joinOutput = vscode.workspace.getConfiguration().get("pjsub.joinOutput", true);

    return `#!/bin/sh

#------ pjsub option --------# 
#PJM -L rscgrp=${resourceGroup}
#PJM -L node=${nodeCount}
#PJM -L elapse=${elapsedTime}
#PJM -g ${projectGroup}
${joinOutput ? "#PJM -j" : ""}

#------- Program execution -------#

export MPLCONFIGDIR="/data/scratch/gg53/d58004/matplotlib"
export WANDB_CONFIG_DIR="/data/scratch/gg53/d58004/wandb"
export TRANSFORMERS_CACHE="/data/scratch/gg53/d58004/transformers"
rm -rf /data/scratch/gg53/d58004/bin
cp -r /work/gs58/d58004/mambaforge/bin/ /data/scratch/gg53/d58004/bin
export PATH="/data/scratch/gg53/d58004/bin:$PATH"
export PATH="/work/gs58/d58004/mambaforge/bin/:$PATH"
export TF_ENABLE_ONEDNN_OPTS=0
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
cd ${workspaceFolder}
python ${pythonFileName}`;
}

// 创建或更新脚本文件，返回最终文件路径
function createOrUpdateScript(
    shFilePath: string,
    content: string,
    folderPath: string,
    baseFileName: string
): string {
    const existingScript = fs.readdirSync(folderPath)
        .filter((file: string) => file.endsWith('.sh') && !file.includes('.out'))
        .find((file: string) => file.includes(`_${baseFileName}.sh`));

    const existingFilePath = existingScript ? path.join(folderPath, existingScript) : null;

    if (existingFilePath && fs.readFileSync(existingFilePath, 'utf8') === content) {
        vscode.window.showInformationMessage(`Using existing script with matching content: ${existingScript}`);
        return existingFilePath;
    }

    const filePathToWrite = existingFilePath || shFilePath;
    fs.writeFileSync(filePathToWrite, content, 'utf8');
    vscode.window.showInformationMessage(`${existingFilePath ? "Updated" : "Generated"} script: ${path.basename(filePathToWrite)}`);
    return filePathToWrite;
}

// 提交脚本
function submitScript(shFilePath: string): void {
    const fileDir = path.dirname(shFilePath);
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pjsub Terminal');
    terminal.show();
    terminal.sendText(`cd "${fileDir}" && pjsub "${shFilePath}"`);
}
