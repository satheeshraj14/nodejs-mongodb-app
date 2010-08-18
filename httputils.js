//thanks to creationix - large protion of the code here is learned from his connect library.

var querystring = require('querystring');
var sys = require('sys');
var multipart = require("deps/multipart-js/lib/multipart");
var fs = require('fs');
var _ = require('deps/nodejs-clone-extend/merger');
this.temp=__dirname+'/temp/';

this.postdecoders =
{
 'application/x-www-form-urlencoded': querystring.parse,
 'application/json': JSON.parse,
};

var mylog='';
function upload_files(request, response, folder, callback) 
{

  // request.setEncoding('binary'); // do not set encoding to binary it needs it as buffer
  // the StringDecoder is initilized lazyly to Stream._decoder and if it is existes it decodes strings to String from Buffer.
  // i need buffer so it is bad to set encoding.
  // 
  // console.log(sys.inspect(request)); // see the request stream.
  //
  //if i will whish to sue decoder it goes like this:
  //
  //var StringDecoder = require("string_decoder").StringDecoder; // lazy load
  //this._decoder = new StringDecoder(encoding);
  //var string = self._decoder.write(pool.slice(start, end));
  //if (string.length) self.emit('data', string);
  

  // matches .xxxxx or [xxxxx] or ['xxxxx'] or ["xxxxx"] with optional [] at the end
  var chunks = /(?:(?:^|\.)([^\[\(\.]+)(?=\[|\.|$|\()|\[([^"'][^\]]*?)\]|\["([^\]"]*?)"\]|\['([^\]']*?)'\])(\[\])?/g;
  // Parse a key=val string.
  function add_to_object_by_name (obj, key, value) // a modified version of QueryString.parse = QueryString.decode 
  {
   try
   {
      var res=obj,next;
      key.replace(chunks, function (all, name, nameInBrackets, nameIn2Quotes, nameIn1Quotes, isArray, offset) {
        var end = offset + all.length == key.length;
        name = name || nameInBrackets || nameIn2Quotes || nameIn1Quotes;
        next = end ? value : {};
        //next = next && (+next == next ? +next : next);
        if (Array.isArray(res[name])) {
          res[name].push(next);
          res = next;
        } else {
          if (name in res) {
            if (isArray || end) {
              res = (res[name] = [res[name], next])[1];
            } else {
              res = res[name];
            }
          } else {
            if (isArray) {
              res = (res[name] = [next])[0];
            } else {
              res = res[name] = next;
            }
          }
        }
      });
    }
    catch(err)
    {
     err.message="error parsing variable names of post , form elements.\r\n"+err.message;
     err.stack="error parsing variable names of post , form elements.\r\n"+err.stack;
     throw err
    }
    return obj;
  };
  

  var parser = multipart.parser();
  parser.headers = request.headers;
  
  var request_vars=[];
  var name, savename, filename, text, file;
  var inquee=0,finished=false;  
  if(folder.charAt(folder.length-1)!='/') folder+='/';
   
  parser.addListener('onPartBegin', function(part)
  {
    inquee++;
    name = part.name;
    //console.log('begin name '+ name)
    if(!part.filename)
    {
     //request.setEncoding('utf8');
     text="";
     file=false;
     inquee--;
     if(finished&&inquee==0)
     {
      callback(null,request_vars); // if file writing goes beyond parsing, call callback it later when done.
     }
    }
    else
    {
      var randomname=(((new Date()).getTime()*10000)+(Math.floor(Math.random() * 9999)))+".tmp";
      savename=folder+randomname;
      file = fs.createWriteStream(savename,{ 'flags': 'w', 'encoding': 'binary', 'mode': 0666 });
      file.addListener('close', function(part)
      {
       inquee--;
       if(finished&&inquee==0)
       {
        callback(null,request_vars); // if file writing goes beyond parsing, call callback it later when done.
       }
      });
    }
    // instead onData and onPartEnd, a pump should be set up here
    // like: sys.pump(part, file, function()  { sys.debug('file pump end');  });
  });
  
  /*
  function(part)
  {
     inquee--;
     if(finished&&inquee==0)
      callback(null,request_vars); // if file writing goes beyond parsing, call callback it later when done.
  }
  */
  parser.addListener('onData', function(chunk) { if(file) file.write(chunk); else  text+=chunk;  });
  parser.addListener('onPartEnd', function(part)
  {
   //console.log(sys.inspect(part.headers['content-type']));
   //console.log(sys.inspect(part.headers['content-disposition']));
   if(file)
   {
    add_to_object_by_name(request_vars,part.name,{filename:part.filename,path:savename,mime:part.headers['content-type']});
    file.end();
   }
   else
   {
    
    add_to_object_by_name(request_vars,part.name,text);
   }
  });
  parser.addListener('onEnd', function(part)   {  finished=true;  if(inquee==0) callback(null,request_vars);}); 
  parser.addListener('onError', function(err) {  console.log(' parser on end  '); callback(err,request_vars); });
  sys.pump(request, parser, function()  { console.log('request end');  });
}


this.post=function (req, res, callback )
{
 //console.log("post received:");
 //console.log(sys.inspect(req.post));
 callback(req.post);
}

this.realpost=function (req, res, callback ) 
// called first of all to overcome a bug in node js 
// (it could be called any time in any page.
// but there is a bug: the request object dies at the end of a function,
// for example if the later work is done in a settimeout
// so to overcome i have renamed post to realpost
// called realpost as first thing in process request
// it continues to the callback
// later it uses the "post" merthod to get what was posted
// and fetched at the begining with realpost)
// when this bug is fixed i can rename back realpost to post.
{
 if(
  req.method==='POST'
  // || req.method=='PUT' 
 )
 {
  var content_type='';
  var decoder=false;
  if(req.headers['content-type'])
  {
   content_type=req.headers['content-type'].split(';')[0];
   if(this.postdecoders[content_type])
    decoder=this.postdecoders[content_type];
  }
  var data = '';
  if(req.headers['content-type'].indexOf('multipart/form-data')==-1) 
  {
    try
    {
     //console.log("POST6");
     req.setEncoding('utf8');
     //console.log(sys.inspect(req._events));
     req.on('data', function(chunk)
     {
      // console.log("POST7");
      data += chunk;
     });
     req.on('end', function()
     {
      //console.log("POST8");
      //req.postmime = content_type;
      //req.postraw = data;
      if(decoder)
      {
       try
       {
        req.post = decoder(data);
        callback(req.post);
       }
       catch (err)
       {
        callback({});
       }
      }
      else
      {
       //console.log("POST9");
       callback({});
      }
     });

    }catch(e){console.log(e.stack);}
    //console.log("post readble:"+(req.connection.readable));
    //req.resume();
  }
  else
  {
   //console.log("GONE TO UPLOAD FILES");
    upload_files(req, res,this.temp,function(error,data)
    {
     req.post = data;
     if(error!==null) callback({});
     else             callback(data);
    });
  }
 }
 else
 {
  callback({});
 }
}
 
this.referrer = function(req, res, callback) 
{
 // actualy no need call back here because it is not transfering any thing
 if(callback)
  callback(req, res,req.headers.referrer || req.headers.referer || "");
 else
  return req.headers.referrer || req.headers.referer || "";
}
 
this.redirect = function(req, res, url, callback, code )
{
 res.writeHead( code || 302, {'Location': url } );
 res.end();
 if(callback)callback();
};
 
 
function parseCookie(str)
{
    var obj = {},
        pairs = str.split(/[;,] */);
    for (var i = 0, len = pairs.length; i < len; ++i) {
        var pair = pairs[i],
            eqlIndex = pair.indexOf('='),
            key = pair.substr(0, eqlIndex).trim().toLowerCase(),
            val = pair.substr(++eqlIndex, pair.length).trim();
        // Quoted values
        if (val[0] === '"') {
            val = val.slice(1, -1);
        }
        // Only assign once
        if (obj[key] === undefined) {
            obj[key] = querystring.unescape(val, true);
        }
    }
    return obj;
} this.parseCookie=parseCookie; 
 
function cookie(req)
{
 if(req.headers.cookie)
 {
  req.parsedcookie=parseCookie(req.headers.cookie);
  return req.parsedcookie;
 }
 return {};
};this.cookie = cookie;


function session_start(req,header)
{
 var parsedcookie=cookie(req),sid;  // cookie names are lowercase             
 if(parsedcookie['sid'])
 {
  req.session_id=parsedcookie['sid'];
 }
 else
 {
  sid=(((new Date()).getTime()*10000)+(Math.floor(Math.random() * 9999)))
  req.session_id=sid;
  header['Set-Cookie']='sid="'+sid+'"; path=/'+(req.secure?'; secure:':'');
 }
 return parsedcookie;     
} this.session_start=session_start; 
 
function session_save(req)
{
 if(req.session_id);
} this.session_save=session_save;

function session_load(req)
{
 if(req.session_id);
} this.session_load=session_load; 