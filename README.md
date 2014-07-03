node-vc
=======

一个不到200行代码的"node 视图-控制器"小框架。

# 特性

## 路由映射
`'post:/submit' : 'handlerName'`，`handlerName`会处理`/submit`请求的`post`类型。

## 视图渲染随心定制
可以在运行时随时随地改变json输出还是基于ejs的html输出

# 例子
啥都不如例子实在，

- 请大家进入example文件夹
- `npm install`安装依赖
- 运行`node app.js`
- 浏览器访问[http://127.0.0.1:8080](http://127.0.0.1:8080)
- 再访问[http://127.0.0.1:8080/index_json](http://127.0.0.1:8080/index_json)看看

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

### 基于ejs的html
在上面定义的views文件夹下创建一个index.ejs文件，关于 [ejs](https://github.com/visionmedia/ejs)。

### 返回json
*参见创建控制器例子*

## 创建控制器
在上面定义的controllers文件夹下建立一个common.js文件，然后在里面写两个函数。

### 举个栗子
	// http:locahost:8080/ 的get类型的请求会定位到这里
	exports.index = function(req, resp, callback){
	  callback(0, 'index', {data : 'Hello World!'});
	}
	// 这个函数会用返回的数据{data:"Hello World"}渲染index.ejs文件
	
	// http:locahost:8080/index_json 的get类型的请求会定位到这里
	exports.index_json = function(req, resp, callback){
	  callback(0, 0, {data : 'Hello World!'});
	}
	// 这个函数没有指定视图
	// 在callback的第二个参数传递0
	// 会把{data : 'Hello World'}直接返回json字符串到浏览器端。

### 控制器获取参数

	exports.controller = (req, resp, callback, params){
	  // 在params中获取你传的参数
	}