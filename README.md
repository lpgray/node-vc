node-vc
=======

A light weight node view-controller framework

## Features

### Route Mapping
Ex: `'post:/submit' : 'handlerName'` will send a post request to the `/submit` url, and the `handlerName` function will be called.

### View Render Engine
You can return json or HTML to the client, and can change the view engine at the runtime.

##Getting Started
### nodevc.json definition
You must **put the nodevc.json file into the folder where you node-start-command start**.

Ex: if I type `node app.js`, you must put the nodevc.json in the same folder with the app.js file.

The `views_folder` and `controllers_folder` are in the same folder too, you can put them all into the root folder of your project.

	{
		"port" : "8080",
		"views_folder" : "views",
		"controllers_folder" : "controllers",
		"mapping" : {
			"/" : "common.index",
			"/index_json" : "common.index_json"
		}
	}

I think it is clear to see.

### write a view
As nodevc.json above, I will add a `index.ejs` into the views folder.

About how to write an ejs template, please go to [the ejs](https://github.com/visionmedia/ejs).

### write a handler
As nodevc.json above, I will add a `common.js` into the controllers folder.

A handler function required three parameters.

- request
- response
- callback

For Example, this is my common.js file:


	exports.index = function(req, resp, callback){
	  callback(0, 'index', {data : 'Hello World!'});
	}
	
	exports.index_json = function(req, resp, callback){
	  callback(0, 0, {data : 'Hello World!'});
	}

the `exports.index` function will return a html string rendered the data based on the `index.ejs` file.

the `exports.index` function will return a json string of the data to the client.