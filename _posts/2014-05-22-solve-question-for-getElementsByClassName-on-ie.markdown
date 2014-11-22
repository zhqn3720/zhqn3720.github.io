---
title: 解决document.getElementsByClassName在IE中的兼容性问题
layout: post
createdate: 2014-05-22 14:19:18
guid: 2014052202
description: 最近遇到一个getElementsByClassName在IE中的兼容性问题，参考了网上的一些代码，写了一段兼容性代码
tags: 
  - JavaScript
--- 
最近遇到一个getElementsByClassName在IE中的兼容性问题，有兼容性问题的代码如下：
{% highlight js %}
window.onload = function(){
    var checkInput = document.getElementsByClassName("check");
    alert(checkInput.length);
}
{% endhighlight %}  
在IE的低版本中会出现如图所示的问题：  
![error](/media/files/2014/05/22/error-for-getElementsByClassName.jpg)  
参考了网上的一些代码与视频，解决代码如下：  
{% highlight js %}
window.onload = function(){
    if(!document.getElementsByClassName){
        document.getElementsByClassName = function (cls){
            var ret = [];
            var els = document.getElementsByTagName('*');
            for(var i = 0 ; i < els.length; i++){
                if(els[i].className === cls 
                   || els[i].className.indexOf(cls + ' ') > -1 
                   || els[i].className.indexOf(' ' + cls + ' ') > -1 
                   || els[i].className.indexOf(' ' + cls) > -1){
                   ret.push(els[i]);
                }    
            }
            return ret;
        }
    }
    var checkInput = document.getElementsByClassName("check");
    alert(checkInput.length);
}
{% endhighlight %}  