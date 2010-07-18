//thanks to creationix - large protion of the code here is learned from his connect library.

var querystring = require('querystring');
var sys = require('sys');

this.postdecoders =
{
 'application/x-www-form-urlencoded': querystring.parse,
 'application/json': JSON.parse,
};
  
this.post=function (req, res, callback)
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
  req.setEncoding('utf8');
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function()
  {
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
     callback();
    }
   }
   else
   {
    callback({});
   } 
  });
 }
 else
 {
  callback({});
 }
}

this.referrer = function(req, res, callback) 
{ // actualy no need call back here because it is not transfering any thing
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
  sid=(((new Date()).getTime()*10000)+(Math.abs((Math.random() * 9999) | 0)))
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