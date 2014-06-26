var http = require('http'),
  ejs = require('ejs'),
  router,
  view_folder,
  controllers_folder;

/**
 * Will called before handler excution
 * @param  {[type]} handler
 * @param  {[type]} req     [http request]
 * @param  {[type]} resp    [http response]
 */
function beforeAction(handler, req, resp) {
  handler(req, resp, function(err, view, data) {
    if (err && view === 'json') {
      resp.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      resp.end(JSON.stringify({
        r: 0,
        msg: err
      }));
      return;
    }

    if (err) {
      resp.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      resp.end(err + '');
      return;
    }

    onResponse(req, resp, {
      view: view,
      data: data
    });
    
  });
}

/**
 * All request start here
 * @param  {[type]} req        [http request]
 * @param  {[type]} resp       [http response]
 */
function onRequest(req, resp) {
  var keyWithMethod = req.method.toLowerCase() + ':' + req.url;

  if (router[req.url]) { // get request or not defined request
    var ctrl_string = router[req.url];
    var module_method_arr = ctrl_string.split('.');
    var module_name = module_method_arr[0];
    var method_name = module_method_arr[1];

    var module = require(controllers_folder + '/' + module_name + '.js');

    beforeAction(module[method_name], req, resp);

  } else if (router[keyWithMethod]) {
    var ctrl_string = router[keyWithMethod];
    var module_method_arr = ctrl_string.split('.');
    var module_name = module_method_arr[0];
    var method_name = module_method_arr[1];

    var module = require(controllers_folder + '/' + module_name + '.js');

    beforeAction(module[method_name], req, resp);

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
  // undefined view
  if (!renderData.view && !renderData.data) {
    resp.writeHead(500, {
      'Content-Type': 'text/html'
    });
    resp.end('<h1>500</h1> template not found');
    return;
  }

  // return json
  if (!renderData.view && renderData.data) {
    resp.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    // resp.end(JSON.stringify(renderData.data));
    resp.end(JSON.stringify({
      r: 1,
      b: renderData.data
    }));
    return;
  }

  // render template
  var data = renderData.data || {};
  ejs.renderFile(view_folder + '/' + renderData.view + '.ejs', data, function(err, html) {
    if (err) {
      resp.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      resp.end(err);
    }
    resp.writeHead(200, {
      'Content-Type': 'text/html'
    });
    resp.end(html);
  });
}

exports.start = function() {
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

  http.createServer(onRequest).listen(vc_config.port);
}