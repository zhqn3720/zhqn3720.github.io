---
layout: post
title: VirtualBox 安装Linux clone
description: VirtualBox 安装Linux clone注意。
category: linux
tags: [Linux Install]
---

# 安装Linux Virbox 虚拟机 clone 遇到问题及解决方法：

- 开机启动自动挂载光盘

```
mkdir /cdrom
mount /dev/cdrom /cdrom/
df -h
echo "mount /dev/cdrom /cdrom/">>/etc/rc.local
```

```
vim /etc/fstab 配置开机挂载
vim /etc/inittab 配置开机启动模式
```

- 配置本地yum源

```
vim /etc/yum.repos.d/local.repo

[Server]
name=Server
baseurl=file:///cdrom/Server
enabled=1
gpgcheck=0

```

- 使用yum源安装桌面

```
yum groupinstall "Desktop" "Desktop Platform" "Desktop Platform Development" -y
yum groupinstall "X Window System" "Desktop"
```

- 网络配置

```
system-config-network
or vim /etc/sysconfig/network-scripts/ifcfg-eth0
service network restart
```

```
clone虚拟机eth0会变成eth1修改如下配置
vim /etc/udev/rules.d/70-persistent-net.rules
vim /etc/sysconfig/network-scripts/ifcfg-eth0
start_udev
```

- ssh登录免除安全验证

```
vim /etc/ssh/sshd_config
修改
GSSAPIAuthentication no
GSSAPICleanupCredentials no
重启ssh服务
/etc/init.d/sshd restart
```

