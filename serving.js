var sys = require('sys'); 
var url = require('url');   // allaws to parse urls                        
var _ = require('merger');  //  lets do: _.extend(same,otherobjexts),  _.clone(obj) - creates new reference, see source to understand // 
var doubletemplate = require('deps/nodejs-meta-templates/doubletemplate');  //load double teplate module
//var doubletemplate=te.doubletemplate; // export double template function to global
var fs = require('fs');    // allaws to open files
var app=require('app_skeleton').app; // include  basic definision of a model and a filed in a model

var modules=[  require('module_mainpage'), ]; // include  basic definision of a model and a filed in a model

//sys.puts('test');
 // install modules
 
 for(var i =0; i < modules.length ; i++ ) modules[i].setupfirst(app);
 for(var i =0; i < modules.length ; i++ ) modules[i].setup(app)   ;
 
 for(var i in app.models) app.models[i].setupfirst(app);
 for(var i in app.models) app.models[i].setup(app);
 for(var i in app.models) app.models[i].setuplast(app);
 
 for(var i =0; i < modules.length ; i++ ) modules[i].setuplast(app) ;
//var app=new app_skeleton();

app = _.extend(app,{
  init: function(db, callback)
  {
    this.setupDb(db, function() { 
    
    doubletemplate
    callback(); } );   
    //    this.setupWebSocket();
    //this.addAllMetrics(db);
  },
  
  setupDb: function(db, callback) {
    
    // simple version:
    // db.createCollection('visits', function(err, collection)
    // {
    //  db.collection('visits', function(err, collection)
    //  {
    //    model.collection = collection;  callback();   });  });
    
    // chained version:
    
    var chain=[]; // 1st createa a chain
    for(modelname in app.models)
    {
     var model=app.models[modelname];
     chain.push       /// push tehre an array of functions to be executed (functions with references) 
     ([ // array of args
       model.general.name      // function arg1
        ,
       function(err, collection) /// function arg2
       {
        sys.puts('create collection:'+modelname+' = '+model.general.name);
        db.collection
        (
         model.general.name
          ,
         function(err, collection)
         {
           model.collection = collection;
           // chain
           if(chain.length==0)   // if we finish scream finish
            callback();
           else
           {
            var a=chain.pop();
            db.createCollection(a[0],a[1]);   /// if not done yet do next
           }
           // end chain 
         }
        );
       }
       , 
      ]);
    }
    //ignite chain
    var a=chain.pop();
    db.createCollection(a[0],a[1]);
    //end ignite chain
  },
  setupPages: function ()
  {
   
  },
/*
  setupWebSocket: function()
  {
    // Websocket TCP server
    var wsServer = ws.createServer({log: false});
    wsServer.listen(config.websocket_port);

    wsServer.addListener("connection", function (conn) {
      sys.log("ws connect: " + conn._id);
      conn.addListener("close", function () {
        sys.log("ws close: " + conn._id);
      });
    });

    this.wsServer = wsServer;

    sys.puts('Web Socket server running at ws://*:' + app.websocket_port);
  },


  addAllMetrics: function(db) {
    var self = this;

    Metric.allMetrics(function(metric) {
      metric.init(db);
      metric.wsServer = self.wsServer;
      self.metrics.push(metric);
    });
  },
  */
  dynamicallyCreateServerHandlerFunction: function ()
  {
   return function (req,res)
   {
    //app.models.mainpage.add({test:'shimon'});
    app.serveRequest(req,res);
   }
  },
  
  serveRequest: function(req, res)
  {
    var myurl=url.parse(req.url);
    var urlmatch=false;
  
    for(i=0;i<app.url_routes.length;i++)
    {
     urlmatch=false;
     if(app.url_routes[i].path=='default') continue; //add defaut  at the end
     if(typeof app.url_routes[i].pathbegins!='undefined')
     {
      if( myurl.pathname.substring(0,app.url_routes[i].pathbegins.length)==app.url_routes[i].pathbegins )
      {
       urlmatch=true;
       sys.puts("match: "+app.url_routes[i].pathbegins);
      }
     }
     else if(typeof app.url_routes[i].path!='undefined')
     {
      if(myurl.pathname==app.url_routes[i].path)
      {
       urlmatch=true;
       sys.puts("match: "+app.url_routes[i].path);
      }
     }
     if(urlmatch)
     {
      if(typeof app.url_routes[i].func!='undefined')
      {
       if(app.url_routes[i].func(data,settings,res,req,myurl))
        return true; // true means break the preview function
      }
      if(typeof app.url_routes[i].page!='undefined')
      {
       if(app.url_routes[i].page.main(req,res,app.url_routes[i].page))
        return true; // true means break the preview function
      }
      else if(typeof app.url_routes[i].code!='undefined')
      {
       var ftext=app.url_routes[i].code.toString();
       ftext=ftext.substring(ftext.indexOf('{')+1,ftext.lastIndexOf('}'));
       eval(ftext);
      }
      //if(typeof app.url_routes[i].dontbreak=='undefined')  myswitch += 'break;';
      //else if(app.url_routes[i].dontbreak==false)  myswitch += 'break;';
     }
     
    }
    
    
    if(!urlmatch)
    {
     //app.urls[0][1][app.urls[0][2]](req, res);
     res.writeHead(200, { 'Content-Type': 'text/plain'});
     res.write("hendle request (req, res) TEST!! ");
     res.end();
    }   
    //this.writePixel(res);

    //var env = this.splitQuery(req.url.split('?')[1]);
    //env.timestamp = new Date();
    // sys.log(JSON.stringify(env, null, 2));

    //var view = new View(env);

    //env.url_key = view.urlKey();
    //env.product_id = view.productId();

    //this.collection.insertAll([env]);

    //for(var i = 0; i < this.metrics.length; i++) {
    //  this.metrics[i].incrementCallback(view);
    //}
  },

  /*
  splitQuery: function(query) {
    var queryString = {};
    (query || "").replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { queryString[$1] = querystring.unescape($3.replace(/\+/g, ' ')); }
    );

    return queryString;
  },
  */
  /*
  writePixel: function(res) {
    res.writeHead(200, { 'Content-Type': 'image/gif',
                         'Content-Disposition': 'inline',
                         'Content-Length': '43' });
    res.end(this.pixel);
  },
*/
  handleError: function(req, res, e) {
    res.writeHead(500, {});
    res.write("Server error");
    res.end();

    e.stack = e.stack.split('\n');
    e.url = req.url;
    sys.log(JSON.stringify(e, null, 2));
  }
});

this.app = app;
