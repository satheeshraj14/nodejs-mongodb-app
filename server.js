//
//
// how it works?
// server
//   \----\
//        |  app skeleton   // creates an app object
//        |  app modules    // extends app object with application objects and functions
//        |  serving        // extends app object with serving functionality and initialization logic.
//
// the idea:
// to create somthing similar to hkvstore.com's Phpmaker or Aspmaker or Microsoft Dot.NET 3 sp1 DynamicData application.
// an application generation framework. to generate nodejs+mongodb(+nginx) applications.
// in those modes of development you configure the data model,
// and all else is kind of, generated or code reused, to create data managment web application.  
// quickly and easyly with very little effort
//
//
// logical object model:
// application
//    \---------\
//              |- shared models
//              |- shared templates of pages
//              |- shared functions of pages
//              |- shared urls
//
// a module extends the application's shared objects.
// shared means shared between all moduls in the application. 
// a module contains aapplication definition code.
// application definition can be spread between many moduls for convinience
// 
// you define a model in a module, then call kind of  a macro function 
// that adds all (edit,add,delete,list) functions and templates and urls to the application 
// as defined by that model.
// also you can define all thouse by your self.
//
// templates system:
// what is good about phpmaker is that it allows you easyly define an application,
// what is good in dot net DynamicData is that the templates are like components.
// in templates you have: fields/textfiled.html, paritials/grid.html, pages/list.html 
// all files composed together.
//

require.paths.unshift(__dirname); //make local paths accecible
//  require('filename')  // include file - filename is without '.js' extention!!!

var sys = require('sys');   // allaws to write to application streams (write to log)
var http = require('http'); // allaws to create http server
var mongo = require('mongodb');  //load double teplate module
var app = require('serving').app;

db = new mongo.Db(app.database.name, new mongo.Server(app.database.host, app.database.port, {}), {});
db.addListener("error", function(error) { sys.puts("Error connecting to mongo -- perhaps it isn't running?"); });

db.open(function(p_db)
{
  //var app = new App();
  app.init(db, 
  function()
  {
   var server_handler_function=app.dynamicallyCreateServerHandlerFunction();
   http.createServer(server_handler_function).listen(app.server.port);
   sys.puts((new Date).toTimeString()+' Server running at http://127.0.0.1:'+app.server.port+'/');
  });
});

// exit if any js file or template file is changed.
// this script encapsualated in a batch while(true); so it runs again after exit.
var autoexit_watch=require('deps/nodejs-autorestart/autoexit').watch;
autoexit_watch(__dirname,".js");
autoexit_watch(__dirname+"/templates",".html");
