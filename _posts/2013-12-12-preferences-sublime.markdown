---
title: Sublime Text 的简单安装与详细配置
layout: post
createdate: 2013-12-12 11:10:01
guid: 2013121201
description: 最近迷上了一款文本编辑器叫Sublime Text，给人的第一感觉是轻，而且里面的各种自定义配置用起来真的是如鱼得水。本文简单介绍了软件的安装与插件的使用以及配置文件的详细备注。
tags:  
  - Sublime Text
---
最近迷上了一款文本编辑器叫`Sublime Text`，[官网](http://www.sublimetext.com/ "Sublime Text 官网")，给人的第一感觉是轻，而且里面的各种自定义配置用起来真的是如鱼得水。写这篇文章主要是防止以后到处寻找而做个备份。
###一、`Sublime Text`的下载安装
进入`Sublime Text`的[官网](http://www.sublimetext.com/ "Sublime Text 官网")，下载`Sublime Text`，有2和3版本，请根据自己爱好进行下载安装。
###二、`Package Control`的安装
首先打开`Console`>>>快捷键：`Ctrl+Esc下面的那个键`，输入下面的代码，然后回车(请注意软件自身的版本)
如果是`Sublime Text3`，代码如下：
{% highlight python %}
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
{% endhighlight %}

如果是`Sublime Text 2`，则代码如下：
{% highlight python %}
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
{% endhighlight %}
重启软件即可。
###三、插件的安装与卸载
1、插件的安装：
重启软件后，快捷键`Ctrl+Shift+P`就可以打开`Package Control`了，输入关键字`Install Package` + `回车`，会进入插件候选安装界面，输入你要安装的插件名称，如`Emmet`，找到后，回车安装。
2、插件的卸载：
打开`Package Control`，输入关键字`Remove Package`+`回车`，会进入插件候选删除界面，输入你要卸载的插件名称，如`Emmet`，找到后，回车卸载。
###四、Preferences.sublime文件的详细配置
接下来就是>>>菜单栏`Preferences>Setting User`打开`Preferences.sublime`配置文件，去搜索了下，具体配置如下:
{% highlight java %}
{
    //主题文件的位置
    "theme":"Centurion.sublime-theme",
    "color_scheme":"Packages/Color Scheme - Default/Monokai.tmTheme",
    //字体
    "font_face":"Consolas",
    //字体大小
    "font_size":11.0,
    "ignored_packages":
    [
        "Vintage"
    ],
    //每行code相对于上一行代码的上边距
    "line_padding_top":2,
    //tab键缩进用空格代替
    "translate_tabs_to_spaces":true,
    //自动换行
    "word_warp":true,
    //tab键制表符宽度
    "tab_size":4,
    //是否显示行号
    "line_number":true,
    //是否显示代码折叠按钮
    "fold_buttons":true,
    //不管鼠标在不在行号边栏，代码折叠按钮一直显示
    "fade_fold_buttons":true,
    //按回车时，自动与制表位对其
    "auto_indent":true,
    //自动匹配引号，括号等
    "auto_match_enabled":true,
    //突出显示当前光标所在行
    "highlight_line":true,
    //设置光标闪动方式
    "caret_style":"smooth",
    //是否特殊显示当前光标所在的括号、代码头尾闭合标记
    "match_brackets":true,
    //切换到其他文件标签或点击其他非本软件区域，文件自动保存
    "save_on_focus_last":true,
    //代码提示
    "auto_complete":true,
    //设置为true时，按Tab会根据前后环境进行代码自动匹配补全
    "tab_completion":true,
    //选中的文本按Ctrl+F时，自动复制到查找面板的文本框里
    "find_selected_text":true,
    //防止SublimeText自动检查更新
    "update_check":false
}
{% endhighlight %}
^_^/，好了，完工，具体使用情况还是要依靠自己的喜好而来，这里的配置并不唯一，请不要在意这些细节~。

>这里留下\*\*工具，请支持正版。[sublime.text.3.x64.patch.by.荒野无灯](http://pan.baidu.com/s/128SAL "百度网盘下载")，\*\*工具具体使用方法，请自行搜索。