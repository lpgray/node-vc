exports.index = function(req, resp, params, callback){
	console.info(params);
  callback(0, 'index', {data : 'Hello node-vc!'});
}

exports.index_json = function(req, resp, params, callback){
	resp.cookies = [
		{
			name : 'Name',
			value : 'Value',
			maxAge : 60
		},
		{
			name : 'Name2',
			value : 'Value2',
			maxAge : 60 * 60,
			httpOnly : true
		}
	];
  callback(0, 0, {data : 'Hello node-vc!'});
}