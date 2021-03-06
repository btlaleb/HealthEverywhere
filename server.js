var express = require('express');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var mongodb_url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://test:test@localhost:27017/myapp';

app.use(require('body-parser')());

// set up handlebars view engine
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main',
				helpers: {
					static: function(name) {
						return require('./lib/static.js').map(name);
					}
			} 
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var mongoose = require('mongoose');
mongoose.connect(mongodb_url);

var Customer = require('./controllers/customer.js');
Customer.registerRoutes(app);

app.set('port', process.env.PORT || 3000);


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", port " +  server_port)
});