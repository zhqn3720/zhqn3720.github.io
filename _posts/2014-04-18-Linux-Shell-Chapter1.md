---
layout: post
title: Linux Shell Chapter1
description: Linux Shell Chapter1
category: Linux
tags: [Linux]
---

# Chapter 1

## 终端

```
$普通用户 #root用户

shell脚本以#!/bin/bash作为前缀

chmod 755 或者 chmod a+x 添加可执行权限

shell脚本中使用 命令之间使用分号或者换行来分隔
```

## 变量

```
使用单引号不会对引号内变量求值

变量赋值
var=value

字符串长度${#var}

查看使用何种shell
$ echo $0
bash
$ echo $SHELL
/bin/bash

UID重要环境变量 root UID=0检测当前脚本以何种用户身份运行

if [ $UID -ne 0 ] ; then
   echo 'please run as root'
else
   echo 'root use'
fi

-lt	      //小于
-eq           //等于
-ne           //不等于
-gt            //大于
```

## 数学运算

- let、(())、[] 基本运算 expr bc高级使用

整数运算

```
num1=4
num2=5
let result=num1+num2

let num1++
let num2++

result2=$[ num1+num2 ]
result3=`expr 3 + 4`
result4=$(expr $num1 + $num2)
```

浮点数运算

```
echo "4 * 0.3" | bc
设定小数点位数scale
echo "scale=2;3/8" | bc

10进制转换2进制
no=100
echo "obase=2;$no" | bc

2进制转换10进制
no1=1100111
echo "obase=10;ibase=2;$no1" | bc

计算平方和平方根
echo "sqrt(100)" | bc
echo "10^3" | bc
```

## 文件描述符

- 0 stadin 标准输入
- 1 stdout 标准输出
- 2 stderr 标准错误

```
stdout 到1.txt stderr.txt
$cmd 1>1.txt 2>2.txt

输出信息全部重定向到一个文件中
$cmd &>output.txt

输出错误信息重定向到/dev/null 清除信息
$cmd 2>/dev/null
```

## 数组

```
定义赋值数组
array1=(1 2 3 4)
echo ${array1[0]} 
array1[0]="test"
echo ${array1[0]} 

index=3
echo ${array1[$index]}
打印全部
echo ${array1[@]}

```

## 使用别名

```
alias la='ll -a'

终端只对本次设定有效，写如.bashrc对系统有效
```

## 时间

```
$date +%s 时间戳
```

## 读取键盘输入

```
read -s var
echo $var
```

## 循环

- for

```
for var in list;
do
commands;
done;
```

- while

```
while condition
do 
commands;
done
```
