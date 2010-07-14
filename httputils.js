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
