export { parseNodeUsage, parseGpuUsage, parseTaskId};

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

// 解析任务ID的辅助函数
function parseTaskId(output: string): string {
    const match = output.match(/Job (\d+) submitted/);
    return match ? match[1] : 'unknown';
}