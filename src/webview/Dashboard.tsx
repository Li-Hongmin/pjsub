import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import { FaRegClock, FaDownload, FaExclamationCircle } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

interface ResourceUsage {
    nodes: Record<string, string>;
    gpus: Record<string, string>;
    shorta?: { used: number; total: number; ratio: number };
    regulara?: { used: number; total: number; ratio: number };
    share?: { used: number; total: number; ratio: number };
}

const currentData: ResourceUsage = {
    nodes: {},
    gpus: {},
    shorta: { used: 10, total: 20, ratio: 0.5 },
    regulara: { used: 15, total: 30, ratio: 0.5 },
    share: { used: 5, total: 10, ratio: 0.5 },
};

export function getWebviewContent() {
    const content = ReactDOMServer.renderToString(<Dashboard />);
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resource Monitor</title>
        </head>
        <body>
            <div id="root">${content}</div>
            <script>
                const vscode = acquireVsCodeApi();
            </script>
        </body>
        </html>`;
}

const Dashboard = () => {
    return (
        <div>
            <Card>
                <CardHeader title="Dashboard" />
                <CardContent>
                    <Typography variant="h6">Shorta Ratio: {currentData.shorta?.ratio}</Typography>
                    <Typography variant="h6">Regulara Ratio: {currentData.regulara?.ratio}</Typography>
                    <Typography variant="h6">Share Ratio: {currentData.share?.ratio}</Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;