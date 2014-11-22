---
layout: post
title: hive中如何确定map数
description: hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供完整的sql查询功能，可以将sql语句转换为MapReduce任务进行运行。当运行一个hql语句的时候，map数是如何计算出来的呢？有哪些方法可以调整map数呢？
category: hive
tags: [hive , mapreduce]
---

hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供完整的sql查询功能，可以将sql语句转换为MapReduce任务进行运行。当运行一个hql语句的时候，map数是如何计算出来的呢？有哪些方法可以调整map数呢？

<!-- more -->

# hive默认的input format

在`cdh-4.3.0`的hive中查看`hive.input.format`值（为什么是`hive.input.format`？）：

	hive> set hive.input.format;
	hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;

可以看到默认值为CombineHiveInputFormat，如果你使用的是`IDH`的hive，则默认值为：

	hive> set hive.input.format;
	hive.input.format=org.apache.hadoop.hive.ql.io.HiveInputFormat;

CombineHiveInputFormat类继承自HiveInputFormat，而HiveInputFormat实现了org.apache.hadoop.mapred.InputFormat接口，关于InputFormat的分析，可以参考[Hadoop深入学习：InputFormat组件](http://flyingdutchman.iteye.com/blog/1876400).


# InputFormat接口功能

简单来说，InputFormat主要用于描述输入数据的格式，提供了以下两个功能： 

1)、数据切分，按照某个策略将输入数据且分成若干个split，以便确定Map Task的个数即Mapper的个数，在MapReduce框架中，一个split就意味着需要一个Map Task; 

2)、为Mapper提供输入数据，即给定一个split(使用其中的RecordReader对象)将之解析为一个个的key/value键值对。 

该类接口定义如下：

	public interface InputFormat<K,V>{
		public InputSplit[] getSplits(JobConf job,int numSplits) throws IOException; 
		public RecordReader<K,V> getRecordReader(InputSplit split,JobConf job,Reporter reporter) throws IOException; 
	}
        
其中，getSplit()方法主要用于切分数据，每一份数据由，split只是在逻辑上对数据分片，并不会在磁盘上将数据切分成split物理分片，实际上数据在HDFS上还是以block为基本单位来存储数据的。InputSplit只记录了Mapper要处理的数据的元数据信息，如起始位置、长度和所在的节点。

MapReduce自带了一些InputFormat的实现类： 

![InputFormat实现类](http://dl2.iteye.com/upload/attachment/0085/0423/fa2e8c9f-f26a-3184-98e7-277c1b56fda1.jpg)

hive中有一些InputFormat的实现类，如：

	AvroContainerInputFormat
	RCFileBlockMergeInputFormat
	RCFileInputFormat
	FlatFileInputFormat
	OneNullRowInputFormat
	ReworkMapredInputFormat
	SymbolicInputFormat
	SymlinkTextInputFormat
	HiveInputFormat

HiveInputFormat的子类有：

![HiveInputFormat的子类](/assets/images/2013/implement-of-hiveinputformat.png)

# HiveInputFormat

以HiveInputFormat为例，看看其getSplit()方法逻辑：

	for (Path dir : dirs) {
	  PartitionDesc part = getPartitionDescFromPath(pathToPartitionInfo, dir);
	  // create a new InputFormat instance if this is the first time to see this
	  // class
	  Class inputFormatClass = part.getInputFileFormatClass();
	  InputFormat inputFormat = getInputFormatFromCache(inputFormatClass, job);
	  Utilities.copyTableJobPropertiesToConf(part.getTableDesc(), newjob);

	  // Make filter pushdown information available to getSplits.
	  ArrayList<String> aliases =
	      mrwork.getPathToAliases().get(dir.toUri().toString());
	  if ((aliases != null) && (aliases.size() == 1)) {
	    Operator op = mrwork.getAliasToWork().get(aliases.get(0));
	    if ((op != null) && (op instanceof TableScanOperator)) {
	      TableScanOperator tableScan = (TableScanOperator) op;
	      pushFilters(newjob, tableScan);
	    }
	  }

	  FileInputFormat.setInputPaths(newjob, dir);
	  newjob.setInputFormat(inputFormat.getClass());
	  InputSplit[] iss = inputFormat.getSplits(newjob, numSplits / dirs.length);
	  for (InputSplit is : iss) {
	    result.add(new HiveInputSplit(is, inputFormatClass.getName()));
	  }
	}

上面代码主要过程是：

<blockquote>遍历每个输入目录，然后获得PartitionDesc对象，从该对象调用getInputFileFormatClass方法得到实际的InputFormat类，并调用其`getSplits(newjob, numSplits / dirs.length)`方法。
</blockquote>

按照上面代码逻辑，似乎hive中每一个表都应该有一个InputFormat实现类。在hive中运行下面代码，可以查看建表语句：

	hive> show create table info; 
	OK
	CREATE  TABLE info(
	  statist_date string, 
	  statistics_date string, 
	  inner_code string, 
	  office_no string, 
	  window_no string, 
	  ticket_no string, 
	  id_kind string, 
	  id_no string, 
	  id_name string, 
	  area_center_code string)
	ROW FORMAT DELIMITED 
	  FIELDS TERMINATED BY '\;' 
	  LINES TERMINATED BY '\n' 
	STORED AS INPUTFORMAT 
	  'org.apache.hadoop.mapred.TextInputFormat' 
	OUTPUTFORMAT 
	  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
	LOCATION
	  'hdfs://node:8020/user/hive/warehouse/info'
	TBLPROPERTIES (
	  'numPartitions'='0', 
	  'numFiles'='1', 
	  'transient_lastDdlTime'='1378245263', 
	  'numRows'='0', 
	  'totalSize'='301240320', 
	  'rawDataSize'='0')
	Time taken: 0.497 seconds

从上面可以看到info表的INPUTFORMAT为`org.apache.hadoop.mapred.TextInputFormat`，TextInputFormat继承自FileInputFormat。FileInputFormat是一个抽象类，它最重要的功能是为各种InputFormat提供统一的getSplits()方法，该方法最核心的是文件切分算法和Host选择算法。

算法如下：
	
	long length = file.getLen();
	long goalSize = totalSize / (numSplits == 0 ? 1 : numSplits);
	long minSize = Math.max(job.getLong(org.apache.hadoop.mapreduce.lib.input.
	FileInputFormat.SPLIT_MINSIZE, 1), minSplitSize);

	long blockSize = file.getBlockSize();
	long splitSize = computeSplitSize(goalSize, minSize, blockSize);
	long bytesRemaining = length;
	while (((double) bytesRemaining)/splitSize > SPLIT_SLOP) {
	String[] splitHosts = getSplitHosts(blkLocations, 
		length-bytesRemaining, splitSize, clusterMap);
		splits.add(makeSplit(path, length-bytesRemaining, splitSize, 
			       splitHosts));
		bytesRemaining -= splitSize;
	}


----

`华丽的分割线`：以下摘抄自[Hadoop深入学习：InputFormat组件](http://flyingdutchman.iteye.com/blog/1876400)

**1）、文件切分算法** 

文件切分算法主要用于确定InputSplit的个数以及每个InputSplit对应的数据段，FileInputSplit以文件为单位切分生成InputSplit。有三个属性值来确定InputSplit的个数：
 
- goalSize：该值由totalSize/numSplits来确定InputSplit的长度，它是根据用户的期望的InputSplit个数计算出来的；numSplits为用户设定的Map Task的个数，默认为1。 
- minSize：由配置参数mapred.min.split.size（或者 `mapreduce.input.fileinputformat.split.minsize`）决定的InputFormat的最小长度，默认为1。 
- blockSize：HDFS中的文件存储块block的大小，默认为64MB。
- numSplits=`mapred.map.tasks` 或者 `mapreduce.job.maps` 

这三个参数决定一个InputFormat分片的最终的长度，计算方法如下： 
      
	splitSize = max{minSize,min{goalSize,blockSize}} 

计算出了分片的长度后，也就确定了InputFormat的数目。 

**2）、host选择算法**
 
InputFormat的切分方案确定后，接下来就是要确定每一个InputSplit的元数据信息。InputSplit元数据通常包括四部分，`<file,start,length,hosts>`其意义为： 

- file标识InputSplit分片所在的文件； 
- InputSplit分片在文件中的的起始位置； 
- InputSplit分片的长度； 
- 分片所在的host节点的列表。 

<blockquote>
InputSplit的host列表的算作策略直接影响到运行作业的本地性。<br/>

我们知道，由于大文件存储在HDFS上的block可能会遍布整个Hadoop集群，而一个InputSplit分片的划分算法可能会导致一个split分片对应多个不在同一个节点上的blocks，这就会使得在Map Task执行过程中会涉及到读其他节点上的属于该Task的block中的数据，从而不能实现数据本地性，而造成更多的网络传输开销。<br/>
 
一个InputSplit分片对应的blocks可能位于多个数据节点地上，但是基于任务调度的效率，通常情况下，不会把一个分片涉及的所有的节点信息都加到其host列表中，而是选择包含该分片的数据总量的最大的前几个节点，作为任务调度时判断是否具有本地性的主要凭证。<br/>
 
FileInputFormat使用了一个启发式的host选择算法：首先按照rack机架包含的数据量对rack排序，然后再在rack内部按照每个node节点包含的数据量对node排序，最后选取前N个(N为block的副本数)node的host作为InputSplit分片的host列表。当任务地调度Task作业时，只要将Task调度给host列表上的节点，就可以认为该Task满足了本地性。 <br/>

从上面的信息我们可以知道，当InputSplit分片的大小大于block的大小时，Map Task并不能完全满足数据的本地性，总有一本分的数据要通过网络从远程节点上读数据，故为了提高Map Task的数据本地性，减少网络传输的开销，应尽量是InputFormat的大小和HDFS的block块大小相同。
</blockquote>

----

# CombineHiveInputFormat

`getSplits(JobConf job, int numSplits)`代码运行过程如下：

	init(job);
	CombineFileInputFormatShim combine = ShimLoader.getHadoopShims().getCombineFileInputFormat();
		ShimLoader.loadShims(HADOOP_SHIM_CLASSES, HadoopShims.class);
			Hadoop23Shims
				HadoopShimsSecure.getCombineFileInputFormat()

CombineFileInputFormatShim继承了`org.apache.hadoop.mapred.lib.CombineFileInputFormat`,CombineFileInputFormatShim的getSplits方法代码如下：

	public InputSplitShim[] getSplits(JobConf job, int numSplits) throws IOException {
	  long minSize = job.getLong("mapred.min.split.size", 0);

	  // For backward compatibility, let the above parameter be used
	  if (job.getLong("mapred.min.split.size.per.node", 0) == 0) {
	    super.setMinSplitSizeNode(minSize);
	  }

	  if (job.getLong("mapred.min.split.size.per.rack", 0) == 0) {
	    super.setMinSplitSizeRack(minSize);
	  }

	  if (job.getLong("mapred.max.split.size", 0) == 0) {
	    super.setMaxSplitSize(minSize);
	  }

	  InputSplit[] splits = (InputSplit[]) super.getSplits(job, numSplits);

	  InputSplitShim[] isplits = new InputSplitShim[splits.length];
	  for (int pos = 0; pos < splits.length; pos++) {
	    isplits[pos] = new InputSplitShim((CombineFileSplit)splits[pos]);
	  }

	  return isplits;
	}

从上面代码可以看出，如果为CombineHiveInputFormat，则以下四个参数起作用：

- mapred.min.split.size 或者 mapreduce.input.fileinputformat.split.minsize
- mapred.max.split.size 或者 mapreduce.input.fileinputformat.split.maxsize
- mapred.min.split.size.per.rack 或者 mapreduce.input.fileinputformat.split.minsize.per.rack
- mapred.min.split.size.per.node 或者 mapreduce.input.fileinputformat.split.minsize.per.node

CombineFileInputFormatShim的getSplits方法最终会调用父类的getSplits方法，拆分算法如下：

	long left = locations[i].getLength();
	long myOffset = locations[i].getOffset();
	long myLength = 0;
	do {
		if (maxSize == 0) {
			myLength = left;
		} else {
		if (left > maxSize && left < 2 * maxSize) {
		  myLength = left / 2;
		} else {
		  myLength = Math.min(maxSize, left);
		}
		}
		OneBlockInfo oneblock = new OneBlockInfo(path, myOffset,
		  myLength, locations[i].getHosts(), locations[i]
		      .getTopologyPaths());
		left -= myLength;
		myOffset += myLength;

		blocksList.add(oneblock);
	} while (left > 0);


# hive中如何确定map数 #

总上总结如下：

如果`hive.input.format=org.apache.hadoop.hive.ql.io.HiveInputFormat`，则这时候的参数如下：

	hive> set mapred.min.split.size;
	mapred.min.split.size=1
	hive> set mapred.map.tasks;
	mapred.map.tasks=2
	hive> set dfs.blocksize;
	dfs.blocksize=134217728

上面参数中mapred.map.tasks为2，dfs.blocksize（使用的是cdh-4.3.0版本的hadoop，这里block和size之间没有逗号）为128M。

假设有一个文件为200M，则按上面HiveInputFormat的split算法：

1、文件总大小为200M，goalSize=200M /2 =100M，minSize=1 ，splitSize = max{1,min{100M,128M}} =100M

2、200M / 100M >1.1,故第一块大小为100M

3、剩下文件大小为100M，小于128M，故第二块大小为100M。

如果`hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat`，则这时候的参数如下：

	hive> set mapred.min.split.size;
	mapred.min.split.size=1
	hive> set mapred.max.split.size;
	mapred.max.split.size=67108864
	hive> set mapred.min.split.size.per.rack;
	mapred.min.split.size.per.rack=1
	hive> set mapred.min.split.size.per.node;
	mapred.min.split.size.per.node=1
	hive> set dfs.blocksize;
	dfs.blocksize=134217728

上面参数中mapred.max.split.size为64M，dfs.blocksize（使用的是cdh-4.3.0版本的hadoop，这里block和size之间没有逗号）为128M。

假设有一个文件为200M，则按上面CombineHiveInputFormat的split算法：

1、128M < 200M <128M X 2，故第一个block大小为128M

2、剩下文件大小为200M-128M=72M，72M < 128M,故第二块大小为72M

# 总结

网上有一些文章关于hive中如何控制map数的文章是否考虑的不够全面，没有具体情况具体分析。简而言之，当InputFormat的实现类为不同类时，拆分块算法都不一样，相关设置参数也不一样，需要具体分析。

## 1. map数不是越多越好

如果一个任务有很多小文件（远远小于块大小128m）,则每个小文件也会被当做一个块，用一个map任务来完成，而一个map任务启动和初始化的时间远远大于逻辑处理的时间，就会造成很大的资源浪费。
而且，同时可执行的map数是受限的。

## 2. 如何适当的增加map数？

- 将数据导入到hive前，手动将大文件拆分为小文件
- 指定map数，使用insert或者create as select语句将一个表导入到另一个表，然后对另一张表做查询


## 3. 一些经验

- 合并小文件可以减少map数，但是会增加网络IO。

- 尽量使拆分块大小和hdfs的块大小接近，避免一个拆分块大小上的多个hdfs块位于不同数据节点，从而降低网络IO。

- 根据实际情况，控制map数量需要遵循两个原则：`使大数据量利用合适的map数`；`使单个map任务处理合适的数据量。`

# 参考文章

- [1] [【hive】hive的查询注意事项以及优化总结](http://f.dataguru.cn/thread-149820-1-1.html)
- [2] [Hadoop中map数的计算](http://blog.sina.com.cn/s/blog_6ff05a2c010178qd.html)
- [3] [[Hive]从一个经典案例看优化mapred.map.tasks的重要性](http://blog.sina.com.cn/s/blog_6ff05a2c0101aqvv.html)
- [4] [hive优化之------控制hive任务中的map数和reduce数](http://superlxw1234.iteye.com/blog/1582880)
- [5] [Hadoop Job Tuning](http://www.searchtb.com/2010/12/hadoop-job-tuning.html)
- [6] [Hive配置项的含义详解（2）](http://www.tuicool.com/articles/77f2Af)
- [7] [Hive小文件合并调研](http://blog.csdn.net/lalaguozhe/article/details/9053645)
[Hadoop深入学习：InputFormat组件](http://flyingdutchman.iteye.com/blog/1876400)

