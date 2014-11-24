# node-vc

一个不到200行代码的"node 视图-控制器"小框架。

## 特性

### 简单的路由映射

`'post:/submit' : 'handlerName'`，`handlerName`会处理`/submit`请求的`post`类型。

### json及html

可以在controller中选择json输出还是基于ejs的html输出。

### 少逻辑

你只需要按例子定义 `nodevc.json` 文件，然后直接在你的入口代码中编写 `require('node-vc').start()` 即可，剩下的都交给你的 `controller` 来处理。

## 例子

- 请查看example文件夹
- `npm install`
- `node app.js`
- 访问[http://127.0.0.1:8080](http://127.0.0.1:8080)
- 再访问[http://127.0.0.1:8080/json](http://127.0.0.1:8080/json)
- 是不是很爽

## 如何开始

### 安装node-vc

	npm install node-vc

### 配置 nodevc.json

添加一个nodevc.json文件，如果你在控制台中运行`node app.js`，你必须把 `nodevc.json` 文件跟`app.js`文件放在同一个文件夹下。

在我下面定义的例子中，views文件夹和controllers文件夹都是在项目根目录。

```javascript
{
	"port" : "8080",
	"views_folder" : "views",
	"controllers_folder" : "controllers",
	"mapping" : {
		"/" : "common.index",
		"/json" : "common.index_json"
	}
}
```
- port: web服务器的port
- views_folder: ejs模板所在的文件夹
- controllers_folder: 控制器所在的文件夹
- mapping: 路由配置，例如当请求首页的时候，会映射到 common.js 的 index 函数。


### 创建一个视图

在上面定义的views文件夹下创建一个index.ejs文件。

### 创建控制器

在上面定义的controllers文件夹下建立一个common.js文件，然后在里面写两个函数。

```javascript
// http:locahost:8080/ 的get类型的请求会定位到这里
// 这个函数会用返回的数据{data:"Hello node-vc"}渲染index.ejs文件
exports.index = function(req, resp, callback){
	callback(0, 'index', {data : 'Hello node-vc!'});
}

// http:locahost:8080/index_json 的get类型的请求会定位到这里
// 这个函数没有指定视图
// 在callback的第二个参数传递0
// 会把{data : 'Hello World'}直接返回json字符串到浏览器端。
exports.index_json = function(req, resp, params, callback){
	callback(0, 0, {data : 'Hello node-vc!'});
}

// 在params中获取你传的参数
exports.controller = (req, resp, params, callback){

}
```

### Cookies



### 拦截器

