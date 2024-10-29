"use strict";
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

exports.parseNodeUsage = parseNodeUsage;
exports.parseGpuUsage = parseGpuUsage;
exports.generateShFileContent = generateShFileContent;
exports.createOrUpdateScript = createOrUpdateScript;
exports.submitScript = submitScript;

// 解析 node usage 输出，直接使用百分比
function parseNodeUsage(output) {
    const nodeInfo = {};
    const nodeLines = output.split('\n').filter(line => /short-a|regular-a/.test(line));

    nodeLines.forEach(line => {
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
function parseGpuUsage(output) {
    const gpuInfo = {};
    // 使用正则表达式精确匹配包含 share-interactive 的行
    const gpuLines = output.split('\n').filter(line => /share-interactive/.test(line));

    gpuLines.forEach(line => {
        const [resource, , usagePercent] = line.trim().split(/\s+/);

        // 如果 resource 包含 "share-interactive"，则只提取 "share-interactive" 部分
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


function generateShFileContent(workspaceFolder, pythonFileName) {
    const resourceGroup = vscode.workspace.getConfiguration().get("pjsub.resourceGroup");
    const nodeCount = vscode.workspace.getConfiguration().get("pjsub.nodeCount");
    const elapsedTime = vscode.workspace.getConfiguration().get("pjsub.elapsedTime");
    const projectGroup = vscode.workspace.getConfiguration().get("pjsub.projectGroup");
    const joinOutput = vscode.workspace.getConfiguration().get("pjsub.joinOutput");

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
function createOrUpdateScript(shFilePath, content, folderPath, baseFileName) {
    const existingScript = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.sh') && !file.includes('.out')) // 过滤掉 .out 文件
        .find(file => file.includes(`_${baseFileName}.sh`));

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
function submitScript(shFilePath) {
    const fileDir = path.dirname(shFilePath);
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pjsub Terminal');
    terminal.show();
    terminal.sendText(`cd "${fileDir}" && pjsub "${shFilePath}"`);
}
