#!/bin/bash

# 更新版本号
echo "Updating version number..."
npm version patch

# 打包插件
echo "Packaging the VS Code extension..."
vsce package

echo "Package complete. The .vsix file has been generated."