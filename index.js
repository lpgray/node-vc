var http = require('http'),
  ejs = require('ejs'),
  router,
  view_folder,
  controllers_folder,
  url = require('url'),
  querystring = require('querystring');

var beforeResponse, beforeRequest;

/**
 * Will called before handler excution
 * @param  {[type]} handler
 * @param  {[type]} req     [http request]
 * @param  {[type]} resp    [http response]
 */
function beforeAction(handler, req, resp, params) {
  handler(req, resp, function(err, view, data) {
    
    if (err && !view) {
      resp.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      resp.end(JSON.stringify({
        r: 0,
        msg: err.toString()
      }));
      return;
    }

    if (err && !!view) {
      resp.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      resp.end(err.toString());
      return;
    }

    onResponse(req, resp, {
      view: view,
      data: data
    });
    
  }, params);
}

/**
 * All request start here
 * @param  {[type]} req        [http request]
 * @param  {[type]} resp       [http response]
 */
function onRequest(req, resp) {
  beforeRequest && beforeRequest.call(null, req, resp);

  var urlObj = url.parse(req.url, true);
  var keyWithMethod = req.method.toLowerCase() + ':' + urlObj.pathname;

  if (req.method.toLowerCase()==='get' && (router[urlObj.pathname] || router['get:' + urlObj.pathname]) ) { // get request or not defined request
    var ctrl_string = router[urlObj.pathname] || router['get:' + urlObj.pathname];
    var module_method_arr = ctrl_string.split('.');
    var module_name = module_method_arr[0];
    var method_name = module_method_arr[1];

    var module = require(controllers_folder + '/' + module_name + '.js');

    beforeAction(module[method_name], req, resp, urlObj.query);

  } else if (router[keyWithMethod]) {
    var ctrl_string = router[keyWithMethod];
    var module_method_arr = ctrl_string.split('.');
    var module_name = module_method_arr[0];
    var method_name = module_method_arr[1];

    var module = require(controllers_folder + '/' + module_name + '.js');

    var data = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk){
      data += chunk.toString();
    })

    req.on('end', function(){
      beforeAction(module[method_name], req, resp, querystring.parse(data));
    })

  } else {
    resp.writeHead(404, {
      'Content-Type': 'text/html'
    });
    resp.end('<h1>404</h1> not found');
  }
}

/**
 * Will called after handler excution
 * @param  {[type]} req        [http request]
 * @param  {[type]} resp       [http response]
 * @param  {[type]} renderData [view name and rendered data]
 */
function onResponse(req, resp, renderData) {
  beforeResponse && beforeResponse.call(null, req, resp, renderData);

  if(resp.cookies){
    var cookies = '';
    resp.cookies.forEach(function(item, idx, arr){
      cookies += item.name;
      cookies += '=';
      cookies += item.value;

      if(item.expire){
        cookies += ';Expires=' + item.expire + ';'
      }
    })
  }

  var data = renderData.data;
  
  // undefined view
  // if (!renderData.view && !renderData.data) {
  //   resp.writeHead(500, {
  //     'Content-Type': 'text/html'
  //   });
  //   resp.end('<h1>500</h1> template not found');
  //   return;
  // }

  // return json
  if (!renderData.view) {
    resp.writeHead(200, {
      'Content-Type': 'text/plain',
      'Set-Cookie' : cookies
    });
    resp.end(JSON.stringify({
      r: 1,
      b: data
    }));
    return;
  }

  // redirect
  if(renderData.view && renderData.view.indexOf('redirect:')>-1){
    var start_pos = renderData.view.indexOf(':');
    resp.writeHead(302, {
      'Location': renderData.view.substring(start_pos+1),
      'Set-Cookie' : cookies
    });
    resp.end();
    return;
  }

  // render template
  ejs.renderFile(view_folder + '/' + renderData.view + '.ejs', data, function(err, html) {
    if (err) {
      resp.writeHead(500, {
        'Content-Type': 'text/plain',
        'Set-Cookie' : cookies
      });
      resp.end(err.toString());
      return;
    }

    resp.writeHead(200, {
      'Content-Type': 'text/html',
      'Set-Cookie' : cookies
    });
    resp.end(html);
  });
}

exports.start = function(port) {
  var start_pos = process.cwd();

  try {
    var vc_config = require(start_pos + '/nodevc.json');
  } catch (e) {
    console.error(e);
    return;
  }

  view_folder = start_pos + '/' + vc_config.views_folder;
  controllers_folder = start_pos + '/' + vc_config.controllers_folder;
  router = vc_config.mapping;

  var the_port = port || vc_config.port;

  var server = http.createServer(onRequest).listen(the_port);
  console.info('nodevc is listening on ' + the_port + '...');

  return server;
}

exports.beforeResponse = function(cb){
  beforeResponse = cb;
}

exports.beforeRequest = function(cb){
  beforeRequest = cb;
}