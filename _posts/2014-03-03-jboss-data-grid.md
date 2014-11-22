---
layout: post
title: JBoss Data Grid 6.2中文用户手册Part I 介绍
description: JBoss Data Grid一种基于内存的分布式数据网格。
category: infinispan
tags: [JBoss Data Grid, infinispan]
---

<p>以下这篇文章由<a title="JBoss Data Grid 6.2" href="https://access.redhat.com/site/documentation/en-US/Red_Hat_JBoss_Data_Grid/6.2/html-single/Getting_Started_Guide/">JBoss Data Grid 6.2 Getting Started Guide</a>翻译而来。</p>
# 特性：
- K-V存储的NoSql的数据库：提供灵活存储，可存储各种结构的数据模型。
- 基于Data Grid的数据存储-能够很轻松地复制到多个节点的数据。
- 支持横向扩展-添加和删除节点的简单，服务不间断。
- 支持多种接入协议-可以使用REST，Memcached的，hot-rod，或简单的map API访问data grid。 

```
注：JBoss Data Grid6.2是基于的Infinispan6.0。
```

# 1. JBoss Data Grid 介绍
## 1.1 JBoss Data Grid配置支持
对于JBoss Data Grid(过去以及现在版本)配置支持配置，请参照[JBoss Data Grid Supported Configurations](https://access.redhat.com/knowledge/articles/115883).

## 1.2 组件和版本
JBoss Data Grid包括许多组件库和`Remote Client-Server modes`。可在Boss Data Grid组件详细信息页面查看[Components and Versions](https://access.redhat.com/site/articles/488833)
## 1.3 JBoss Data Grid使用模式
JBoss Data Grid有俩种使用模式：

- Remote Client-Server mode
 - Remote Client-Server mode提供一个可管理的，分布式，集群的Data Grid服务。应用程序可以通过Hot Rod、Memcached、Map API REST远程访问。在Remote Client-Server mode模式下所有的操作都是非事务性。Remote Client-Server mode模式不支持事务操作。如果不需要支持事务功能，使用Remote Client-Server mode是很好的选择。使用如下命令启动:`$ JBOSS_HOME / bin中/ standalone.sh`.
- Library mode
 - Library mode允许创建和部署一个自定义的运行环境。应用过程中Library mode的主机在单个数据节点，远程访问其他JVM节点。JBoss Web Server 2和JBossEAP 6可以使用JBoss Data Grid的Library mode。许多JBoss Data Grid的功能只能在Library mode下使用。下列功能要求之用在Library mode下：

  **事务**

  **监听和通知**

JBoss Data Grid可以运行在Java SE的一个独立JVM中。JBoss Data Grid也支持在容器中[如JBoss中]运行。


## 1.4 JBoss Data Grid的优势
**性能：**

- 从内存访问对象是比访问远程数据存储(如数据库)的对象更快。JBoss Data Grid把数据存储在内存中，因为访问速度的性能比远程数据存储的更快。JBoss Data Grid还提供为集群部署和非集群缓存，以进一步提高性能。

**一致性**

在Cacha中存储的数据存在风险：在被访问时，数据可能已经过期。JBoss Data Grid使用机制，如Cacha失效和过期从Cacha中删除过期的数据项。此外， JBoss Data GridJTA ，分布式(XA)和俩阶段提交事务与事务恢复，提交版本的API用来根据保存的版本删除或替换数据。

**大堆内存和高可用性**

JBoss Data Grid中，在大数据量下的查询不再依赖于单个大数据库服务器的性能，JBoss Data Grid采用复制和分布式技术，解决目前大多数企业应用中瓶颈。


**可扩展性**

分布式部署复制的集群Cache的好处是，JBoss Data Grid的可扩展性可以通过在集群中添加节点增加容量和性能。JBoss Data Grid使用一致性Hash算法，限制添加或删除一个节点到节点，而不是集群中每个节点的一个子集的影响。
集群的大小的唯一上限是网络上的组通信。该网络的组通信是最小的，仅限于新节点的发现。节点允许的所有数据访问模式，直接通过对等体的对等连接通信，便于进一步提高可扩展性。 JBoss Data Grid集群可以实时增大或减小，而不需要基础服务的重新启动。改变增大减小规则对实时应用程序的使用非常灵活。

**数据分发**
JBoss Data Grid使用一致性Hash算法，以确定在集群中key的位置。与一致性哈希相关的优点包括：

 - 花费成本
 - 速度
 - 查询key的位置不需要更多的元数据以及网络流量

数据分布保证了集群内存中存在足够数量的副本，以提供耐用性和容错性。如果数据没有副本，将减少环境的可扩展性。
你可能会用到的标记语言和模板引擎：

**持久性**

JBoss Data Grid开放了Cache存储接口和几个高性能的实现，包括基于Cache存储的JDBC缓存存储和文件系统。

**语言支持**

JBoss Data Grid支持流行的Memcached协议，客户端支持多种流行的编程语言，以及一个优化的JBoss Data Grid特定的Hot Rod协议。因此JBoss Data Grid可以被各种网站应用程序使用。此外，remote caches可以通过一个REST API使用HTTP协议来访问。

## 1.5 Red Hat JBoss Data Grid 版本信息

Red Hat JBoss Data Grid是在Infinispan的基础上构建的Data Grid软件的开源社区版本。Infinispan的使用代码，设计和想法基于JBoss Cache。并在高压力下经过测试。

下表列出的JBoss Data Grid和Infinispan的版本之间的相关性。

```
JBoss Data Grid Product		Infinispan Version
JBoss Data Grid 6.0.0	 	Infinispan 5.1.5
JBoss Data Grid 6.0.1	 	Infinispan 5.1.7
JBoss Data Grid 6.1.0	 	Infinispan 5.2.4
JBoss Data Grid 6.2.0	 	Infinispan 6.0.1
```

## 1.6 Red Hat JBoss Data Grid Cache架构

以下是JBoss Data Grid架构图：

<div class="pic">
<img class="aligncenter size-medium wp-image-2287" title="JDGArchitecture" src="/assets/images/2014/JDGArchitecture.png" alt="" width="800" height="200" /></div>


Red Hat JBoss Data Grid Cache架构图描绘了各个要素及其相互作用。俩图分别表示JBoss Data Grid俩种使用模式。

为清楚起见，每个高速缓存体系结构图被分离成两部分：
 - 用户(元素)不能直接与(深色空间内元素)进行交互。在Remote Client-Server mode，用户不能与Persistent，Cache，Cache Manager， L1Cache和Server Module交互。在Library mode下，用户不能直接Persistent，Cache交互。
 - 用户(元素)可以直接与(浅色空间内)进行交互。在Remote Client-Server mode，这包括应用程序和Cache Client。在Library mode下，允许用户与Cache，Cache Manager，以及应用程序进行交互。

**架构图中各元素**

 - Persistent(持久性存储)是一个可选组件。它可以在JBoss Data Grid关闭后永久保存恢复的缓存条目。
 - 1级高速缓存(或L1高速缓存):存储远程第一次访问记录，避免远程请求多次读取相同记录。
 - Cache Manager(缓存管理器)控制Cache实例的生命周期，并在需要时可以存储和检索。
 - Cache是用于存储键值检索的主要成分。

**Library 和Remote Client-Server Mode架构**

 - Library Mode下，应用程序(用户代码)可以与Cache和Cache Manager组件直接交互。在这种情况下，应用程序驻留在同一Java虚拟机(JVM)可以直接调用Cache和Cache Manager的Java API的方法。
 - 在Remote Client-Server Mode下，应用程序不直接与Cache和Cache Manager进行交互。此外，应用程序通常在不同的JVM中，不同的物理主机上，并不需要一个Java应用程序。在这种情况下，应用程序使用缓存客户端与远程服务器JDG在使用支持的协议，如Memcached的，Hot Rod，或REST的一个网络通信。

## 1.7 Red Hat JBoss Data Grid APIs

**JBoss Data Grid 可编程API**

 - Cache
 - Batching
 - Grouping
 - Persistence (formerly CacheStore)
 - ConfigurationBuilder
 - Externalizable
 - Notification (also known as the Listener API because it deals with Notifications and Listeners)

**JBoss Data Grid 提供以下API来与Remote Client-Server Mode的Data Grid进行交互**

 - 异步API（只能在与Hot Rod在Remote Client-Server Mode一起使用）
 - REST接口
 - Memcached的接口
 - Hot Rod接口：`RemoteCache API`

