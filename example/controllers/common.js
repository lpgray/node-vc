exports.index = function(req, resp, callback){
  callback(0, 'index', {data : 'Hello World!'});
}

exports.index_json = function(req, resp, callback){
  callback(0, 0, {data : 'Hello World!'});
}