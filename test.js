var sys=require("sys");
function continuable(vars,callback,continuefrom)
{
 var x={};
 with(x)
 {
  var echo="cococo"; 
  console.log(sys.inspect(x.context));
 }
 
 if(!continuefrom)
  continuefrom=null;
 switch(continuefrom)
 {
  case null:
  
 
  case "point1":
   console.log("check point 1");
  
  
  case "point2":
   console.log("check point 2");

  case "point3":
   console.log("check point 3");
 }
 if(callback)
  callback(echo);
 else
  return echo;
}

function detour(val,callback)
{
 console.log("detour");
 if(callback)
  callback(callback);
}

continuable({},function(echo) { console.log("echo was:"+echo);} );

