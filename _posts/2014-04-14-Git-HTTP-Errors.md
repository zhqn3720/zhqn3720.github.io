---
layout: post
title: Git HTTP Errors
description: Git HTTP Errors
category: Git
tags: [Git]
---

# 如何应对 Git 操作时候的 HTTP 错误

## HTTP Errors

如果你在使用 HTTP 协议进行 Git 操作的时候出现错误提示：


- 401 错误：

```
$ git push origin master
error: RPC failed; result=22, HTTP code = 401
fatal: The remote end hung up unexpectedly
fatal: The remote end hung up unexpectedly
Everything up-to-date
```

- 403 错误：

```
$ git push origin master
error: RPC failed; result=22, HTTP code = 401
fatal: The remote end hung up unexpectedly
fatal: The remote end hung up unexpectedly
Everything up-to-date
```

上面2个错误有以下几个可能导致的：

Git 版本过低。GitCafe 推荐使用的 Git 版本是 >= 1.7，请参考这里获取最新版本。

$ git --version git version 1.8.2.1
远程仓库路径设置错误。注意，GitCafe 对于路径的识别是大小写敏感的。

查看已有的远程仓库：

```
$ git remote -v
origin  https://gitcafe.com/GitCafe/help.git (fetch)
origin  https://gitcafe.com/GitCafe/help.git (push)
设置新的远程仓库路径：

$ git remote set-url origin https://gitcafe.com/GitCafe/Help.git
查看新的远程仓库路径：

$ git remote -v
origin  https://gitcafe.com/GitCafe/Help.git (fetch)
origin  https://gitcafe.com/GitCafe/Help.git (push)
```

对该仓库没有访问权限。检查你是否对目标仓库有相应的读写权限。
输入了错误的用户名和密码。检查你是否使用了对该仓库有写权限的正确的账户名称和密码，检查是否对所有你名下的仓库均不能访问。

- 411 错误：

```
error: RPC failed; result=22, HTTP code = 411
fatal: The remote end hung up unexpectedly
这个错误是因为是由于上传的包过大 HTTP 的头出错导致的。
```

解决方法：

需要设置http.postBuffer，设置为50MB就可以了

```
git config http.postBuffer 524288000
```


