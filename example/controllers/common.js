exports.index = function(req, resp, params, callback){
	console.info(params);
  callback(0, 'index', {data : 'Hello node-vc!'});
}

exports.index_json = function(req, resp, params, callback){
  callback(0, 0, {data : 'Hello node-vc!'});
}