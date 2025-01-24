# 如何在 win10 上安装 WSL

## 什么是适用于 Linux 的 Windows 子系统？

适用于 Linux 的 Windows 子系统可让开发人员按原样运行 GNU/Linux 环境 - 包括大多数命令行工具、实用工具和应用程序 - 且不会产生传统虚拟机或双启动设置开销。

## 什么是 WSL 2？

(Windows Subsystem for Linux)

WSL 2 是适用于 Linux 的 Windows 子系统体系结构的一个新版本，它支持适用于 Linux 的 Windows 子系统在 Windows 上运行 ELF64 Linux 二进制文件。 它的主要目标是提高文件系统性能，以及添加完全的系统调用兼容性。

## 旧版本 WSL 的手动安装步骤

如果 Windows 版本较新，直接输入

```PowerShell
wsl --install
```

### 步骤一 启用适用于 Linux 的 Windows 子系统

以管理员身份打开 PowerShell（“开始”菜单 >“PowerShell” >单击右键 >“以管理员身份运行”），然后输入以下命令：

```PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### 步骤二 检查运行 WSL 2 的要求

- 对于 x64 系统：版本 1903 或更高版本，内部版本为 18362 或更高版本。
- 对于 ARM64 系统：版本 2004 或更高版本，内部版本为 19041 或更高版本。

或 Windows 11。

选择 Windows 徽标键 + R，然后键入“winver”，选择“确定”。

<!-- 插入图片 -->

::: info
如果运行的是 Windows 10 版本 1903 或 1909，请在 Windows 菜单中打开“设置”，导航到“更新和安全性”，然后选择“检查更新”。 内部版本号必须是 18362.1049+ 或 18363.1049+，次要内部版本号需要高于 .1049。 阅读详细信息：WSL 2 即将支持 Windows 10 版本 1903 和 1909。
:::

### 步骤三 启用虚拟机功能

安装 WSL 2 之前，必须启用“虚拟机平台”可选功能。 计算机需要虚拟化功能才能使用此功能。

以管理员身份打开 PowerShell 并运行：

```PowerShell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

重新启动计算机，以完成 WSL 安装并更新到 WSL 2。

### 步骤四 下载 Linux 内核更新包

1. <a href="https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi">适用于 x64 计算机的 WSL2 Linux 内核更新包</a>

::: info
如果使用的是 ARM64 计算机，请下载 ARM64 包。 如果不确定自己计算机的类型，请打开命令提示符或 PowerShell，并输入：systeminfo | find "System Type"。
Caveat： 在非英文版 Windows 上，你可能必须修改搜索文本，对“System Type”字符串进行翻译。 你可能还需要对引号进行转义来用于 find 命令。 例如，在德语版中使用 systeminfo | find '"Systemtyp"'。
:::

2. 运行上一步中下载的更新包。 （双击以运行 - 系统将提示你提供提升的权限，选择“是”以批准此安装。）

### 步骤五 将 WSL 2 设置为默认版本

```PowerShell
wsl --set-default-version 2
```

### 步骤六 安装所选的 Linux 分发

- [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
- [Ubuntu 20.04 LTS](https://www.microsoft.com/store/apps/9n6svws3rx71)
- ...

## 下载发行版

如果在应用商店安装不了，可以直接下载发行版

- [Ubuntu](https://aka.ms/wslubuntu)
- [Ubuntu 22.04 LTS](https://aka.ms/wslubuntu2204)
- [Ubuntu 20.04](https://aka.ms/wslubuntu2004)
- [Ubuntu 20.04 ARM](https://aka.ms/wslubuntu2204arm)
- [Ubuntu 18.04](https://aka.ms/wsl-ubuntu-1804)

## 参考资料

- https://learn.microsoft.com/zh-cn/windows/wsl/install-manual
