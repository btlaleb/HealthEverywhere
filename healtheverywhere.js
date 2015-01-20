var express = require('express');
var app = express();

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
mongoose.connect('mongodb://test:test@healtheverywhere-advensys.rhcloud.com/healtheverywhere');

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

app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
	app.get('port') + '; press Ctrl-C to terminate.' );
});