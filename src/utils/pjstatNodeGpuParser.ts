import { exec } from 'child_process';

interface ResourceGroupInfo {
    name: string;
    ratio: string;
    used: number;
    total: number;
}

interface SystemInfo {
    system: string;
    resourceGroups: ResourceGroupInfo[];
}

function parsePjstatNodeGpuOutput(output: string): SystemInfo[] {
    const lines = output.split('\n');
    const systems: SystemInfo[] = [];
    let currentSystem: SystemInfo | null = null;

    for (const line of lines) {
        // 处理空行
        if (!line.trim()) continue;

        // 系统行检测
        if (line.startsWith('SYSTEM:')) {
            if (currentSystem) {
                systems.push(currentSystem);
            }
            currentSystem = {
                system: line.split(':')[1].trim(),
                resourceGroups: []
            };
            continue;
        }

        // 跳过标题行
        if (line.includes('RSCGRP') || line.includes('Ratio')) {
            continue;
        }

        // 处理资源组信息行
        if (currentSystem && line.includes('%')) {
            // 将连续的空格替换为单个空格，并分割字符串
            const parts = line.trim().split(/\s+/);

            // 从末尾开始解析，因为格式是固定的
            // 最后的格式是 "used/total"
            const total = parseInt(parts.pop()!, 10);
            let used = parts.pop()!;
            if (used.endsWith('/')) {
                used = used.slice(0, -1);
            }
            const ratio = parts.pop()!;
            const name = parts.join(' ').replace(/[*]+/g, '').replace(/-+$/, '').trim();

            if (!isNaN(parseInt(used, 10)) && !isNaN(total)) {
                currentSystem.resourceGroups.push({
                    name,
                    ratio,
                    used: Number(used),
                    total: Number(total)
                });
            }
        }
    }

    // 添加最后一个系统
    if (currentSystem) {
        systems.push(currentSystem);
    }

    return systems;
}

function getPjstatNodeGpuInfo(option: '--nodeuse' | '--gpuuse'): Promise<SystemInfo[]> {
    return new Promise((resolve, reject) => {
        exec(`pjstat ${option}`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`执行 pjstat ${option} 失败: ${error.message}`));
                return;
            }
            if (stderr) {
                reject(new Error(`pjstat ${option} 返回错误: ${stderr}`));
                return;
            }
            try {
                const result = parsePjstatNodeGpuOutput(stdout);
                resolve(result);
            } catch (err) {
                reject(new Error(`解析 pjstat 输出失败: ${(err as Error).message}`));
            }
        });
    });
}

// 测试代码
async function test() {
    try {
        // 测试节点使用情况
        console.log('Testing node usage...');
        const nodeUsage = await getPjstatNodeGpuInfo('--nodeuse');
        console.log(JSON.stringify(nodeUsage, null, 2));

        // 测试GPU使用情况
        console.log('\nTesting GPU usage...');
        const gpuUsage = await getPjstatNodeGpuInfo('--gpuuse');
        console.log(JSON.stringify(gpuUsage, null, 2));
    } catch (error) {
        console.error('Error:', (error as Error).message);
    }
}

// 导出必要的类型和函数
export { 
    getPjstatNodeGpuInfo,
    SystemInfo,
    ResourceGroupInfo
};