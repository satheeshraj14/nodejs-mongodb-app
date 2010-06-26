
function replace(a, b)
{
 if (!b) return a;
 var key;
 for (key in b) a[key] = b[key];
 return a;
} this.replace=replace;
  

function extend(a, b)
{
 if (!b) return a;
 var key;
 for (key in b)
 {
  if(typeof a[key] === 'undefined')
  {
        if(typeof b[key] === 'object') a[key] = extend({}, b[key]);
   else if(typeof b[key] === 'array' ) a[key] = extend([], b[key]);
   else                                a[key] = b[key];
  }
  else if(typeof a[key] === 'object' || typeof a[key] === 'array')
                                       a[key] = extend(a[key], b[key]);
  else  
                                       a[key] = b[key];
 }
 return a;
} this.extend=extend;

function clone(obj)
{
 if (typeof obj === 'object') return extend({}, obj);
 else if (typeof obj === 'array')  return extend([], obj);
 return obj;
} this.clone=clone;