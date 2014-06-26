node-vc
=======

一个不到100行代码跑web"视图-控制器"小框架。

# 特性

## 路由映射
例如：配置一个 `'post:/submit' : 'handlerName'`，`handlerName`会处理`/submit`请求的`post`类型。

## 视图渲染随心定制
可以在运行时随时随地改变json输出还是基于ejs的html输出

#Getting Started
## 配置文件 nodevc.json
配置一个nodevc.json文件，如果你在控制台中运行`node app.js`，你必须把 `nodevc.json` 文件跟`app.js`文件放在同一个文件夹下。

在我下面定义的例子中，views文件夹和controllers文件夹都是在项目根目录。

	{
		"port" : "8080",
		"views_folder" : "views",
		"controllers_folder" : "controllers",
		"mapping" : {
			"/" : "common.index",
			"/index_json" : "common.index_json"
		}
	}

参数解读：

- port: web服务器的port
- views_folder: ejs模板所在的文件夹
- controllers_folder: 控制器所在的文件夹
- mapping: 路由配置，例如当请求首页的时候，会映射到 common.js 的 index 函数。


## 创建一个视图
在上面定义的views文件夹下创建一个index.ejs文件，关于 [ejs](https://github.com/visionmedia/ejs)。

## 创建一个控制器
在上面定义的controllers文件夹下建立一个common.js文件，然后在里面写两个函数。

例如，你可以这样写:


	exports.index = function(req, resp, callback){
	  callback(0, 'index', {data : 'Hello World!'});
	}

	// 这个函数会用返回的数据{data:"Hello World"}渲染index.ejs文件
	
	exports.index_json = function(req, resp, callback){
	  callback(0, 0, {data : 'Hello World!'});
	}

	// 这个函数没有指定视图，因此直接返回json字符串。



