// var sys = require('sys'); // enable for debugging this module
function replace(a, b)
{
 if (!b) return a;
 var key;
 for (key in b) a[key] = b[key];
 return a;
} this.replace=replace;

function add(a, b)
{
 if (!b) return a;
 var key;
 for (key in b)
  if(typeof a[key] === 'undefined')
   a[key] = b[key];
 return a;
} this.add=add;

function extend(a, b)
{
 if (!b) return a;
 var key;
 for (key in b)
 {
  if(typeof a[key] === 'undefined')
  {
   if(typeof b[key] === 'object')
   {
    if( b[key] instanceof Array ) // http://javascript.crockford.com/remedial.html
     a[key] = extend([], b[key]);
    else
     a[key] = extend({}, b[key]);
   }
   else
     a[key] = b[key];
  }
  else if(typeof a[key] === 'object')
    a[key] = extend(a[key], b[key]);
  else  
    a[key] = b[key];
 }
 return a;
} this.extend=extend;

function clone(obj)
{
 if (typeof obj === 'object')
 {
  if (obj instanceof Array ) return extend([], obj);
  return extend({}, obj);
 }
 return obj;
} this.clone=clone;