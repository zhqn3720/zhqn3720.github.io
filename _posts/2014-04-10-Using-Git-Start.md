---
layout: post
title: Git深入学习
description: Git命令
category: Git
tags: [Git VCS]
---


# 1 设置Git

```
设置全局变量
git config --global user.name "allen.liu"
git config --global user.email "allen.liu@***.com"

查看设置是否成功
git config --global --list

命令行使用不同显色显示不同内容
git config --global color.ui "auto"

查看帮助命令
git help <command>
```

# 2 创建项目

```
创建项目文件夹 Git初始化
mkdir firstgitproject
cd firstgitproject
git init

创建文件 
touch index.html

提交文件
git add index.html
git commit -m "add index.html"

git commit -a 提交全部修改过的文件

撤销本地某次提交后全部提交(未提交到远程服务器) 
git reset --hard <commit_id>

删除远程已提交的commit  
git revert <commit_id>
在push最新代码到远程服务器
git push origin master 


查看提交日志
git log  参数 -3  近3次修改

查看工作目录树的状态
git status

```

# 3 分支

```
创建一个新分支
git branch test1.0 master  参数可以是分支名字或者标签名字

切换分支
git checkout test1.0
```

## 添加tag

```
git tag 1.0 test1.0

查看标签 
git tag

推送tag到远程仓库
git push --tags
```

## git rebase

```
切换到主分支
git checkout master

git rebase test1.0

处理冲突后
git rebase --continue
放弃处理
git rebase --abort

test1.0分支取代master 
git rebase --skip
```

```
注
在master分支上进行rebase一般来说应该是不对的。

master分支默认是公共分支，当有多人协同时，master分支在多个地方都有副本。

如果在master分支上执行git rebase test，会把master分支的提交历史进行修改，可以使用git log仔细观察rebase前后，master分支上的commit hash id。

一旦修改了master的commit hash id，而如果其他人已经基于之前的commit对象做了工作，那么当他拉取master的新的对象时，会需要在合并一次，这样反复下去，会把master分支搞得一团乱。

所以你的示例中master分支到提交对象master2、master3，如果已经推送到远端，并有其他人基于master3对象进行了工作，那么后面的结果将会变得非常的乱。

rebase的含义是把当前分支的提交对象在目标分支上重做一遍，并生成了新的提交对象。

所以如果在master分支上需要对test分支进行rebase，你需要的命令是


git rebase master test

这条命令等价于两条命令的合集
git checkout test
git rebase master
```
## 删除分支

```
git branch -d test1.0
-D强制删除
```

## 归档文件

```
git archive 归档文件
```

## 克隆远程版本库

```
git clone git：//github.com/***/***.git mysite
```


# 4 添加和提交

```
文件重命名
git mv index.html hello.html
```

```
设置忽略文件
编辑.gitignore文件 
支持通配符 .*.swp

仅仅本人忽略设置.git/info/exclude/.gitignore文件 
```


# 5 分支深入使用

```
分支重命名
git branch -m oldname newname
-M参数强制重命名
```

创建新分支时机

- 试验性修改 
- 增加新功能
- Bug修复

```
快速创建分支并切换分支方法
git checkout -b test3.0 master
```
## 删除远程分支

```
删除远程分支
git branch -d test
git push origin :test
```

## 合并分支

- 直接合并

```
git checkout master
git merge 分支名
```

- 压合合并

```
在一个新分支test 提交俩次后，切换master
git checkout master
将test分支上所有提交压合成一个提交
git merge --squash test
主分支上提交此次提交
git commit -m "add contact"
```

- 拣选合并

```
test 分支提交一次 提交名字c13aee0
切换到master
git cherry-pick c13aee0
拣选多个提交 -n 参数
```

## 冲突处理

```
git mergetool 提供系统工具处理或者直接编辑后提交
```

# 5 远程版本库

## 添加远程共享仓库

```
git pull origin
远程版本库别名origin

添加远程版本库
git remote add tmp https://github.com/AllenLiuembracesource/testgit.git

添加文件提交 到origin
git add .
git commit -m "add new remote"
git push origin master

提交项目到 testgit项目下
git push -f  tmp master:master

下载远程版本库切换到 tmp下
git fetch tmp
git branch tmp tmp/master 
Branch tmp set up to track remote branch master from tmp by rebasing.

push tmp 到tmp下master分支下
git push tmp tmp：master 

```

# 5 patch合并

## 重新排序提交

```
使用编辑器排序近期3个提交
git rebase -i HEAD~3
```

## 将多个提交合并成一个提交

```
git rebase -i <commit_id>
使用编辑器 pick 修改为 squash
```
