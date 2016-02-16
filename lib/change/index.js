
var express = require('express');
var app = module.exports = express();
var path = require('path');

var async = require('async'),
	dcopy = require('deep-copy');

var user = require("./user");

app.set('views', __dirname);

app.get('/changepassword', function (req, res, next) {
	_render(req, res, null, next);
});


app.post('/changepassword', function (req, res, next) {
	var result = {"success":"", "error":""};
	var file = req.files.input_data;
	user.change(req, res, req.body.old, req.body.new, function(err, user){
		if(err) {
			result.error = err.message;
		}else {
			result.success = "password changed";
		}
		_render(req, res, result, next);
	});
});

function _render(req, res, dataToShow, next){
	var relative = path.relative(res.locals._admin.views, app.get('views'));

	res.locals.show = dataToShow;
	res.locals.csrf = req.csrfToken();

	res.locals.partials = {
		content: path.join(relative, 'view')
	};

	next();
}