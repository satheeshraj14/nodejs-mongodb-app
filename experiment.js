require.paths.unshift(__dirname);
var http = require('http');
var sys = require('sys');

var mongo = require('deps/node-mongodb-native/lib/mongodb');
var app = require('serving').app;


http.createServer(function(req, res) {

	res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Hello world\n');
        


}).listen(8124, "127.0.0.1");


db = new mongo.Db(app.database.name, new mongo.Server(app.database.host, app.database.port,{}), {});

sys.puts("Database name : "+app.database.name);
sys.puts("\nDatabase host : "+app.database.host);
sys.puts("\nDatabase port : "+app.database.port);

db.addListener("error", function(error) { sys.puts("Error connecting on database -- perhaps it isn't running"); });

/*db.open(function(err, db) {
    db.collection('things', function(err, collection) {
          collection.insert(row);
        collection.find({}, null, function(err, cursor) {
            cursor.each(function(err, doc) {
                sys.puts(sys.inspect(doc,true));
            });
        });

    });
});*/

/*db.open(function(err, db) {
    db.collection(app.database.name, function(err, collection) {
          collection.insert(row);
        collection.find({}, null, function(err, cursor) {
            cursor.each(function(err, doc) {
                sys.puts(sys.inspect(doc,true));
            });
        });

    });
});*/

var client = new db('integration_tests_20', new Server("127.0.0.1", 27017, {}));
  client.open(function(p_client) {
  	client.createCollection('test_insert', function(err, collection) {
  	  client.collection('test_insert', function(err, collection) {
  	    for(var i = 1; i < 1000; i++) {
  	      collection.insert({c:1}, function(err, docs) {});
  	    }

  	    collection.insert({a:2}, function(err, docs) {
  	      collection.insert({a:3}, function(err, docs) {
  	        collection.count(function(err, count) {
  	          test.assertEquals(1001, count);
  	          // Locate all the entries using find
  	          collection.find(function(err, cursor) {
  	            cursor.toArray(function(err, results) {
  	              test.assertEquals(1001, results.length);
  	              test.assertTrue(results[0] != null);

  	              // Let's close the db 
  	              client.close();
  	            });
  	          });          
  	        });        
  	      });
  	    });      
  	  });    
  	});
  });





console.log('Binesh decided to run the server from http://127.0.0.1:8127');



