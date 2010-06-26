http://www.robertsosinski.com/2009/04/28/binding-scope-in-javascript/
a real oop javascript framework is ajax.org you can learn more from it about objects and exported functions
//
http://www.packtpub.com/article/using-prototype-property-in-javascript
http://mckoss.com/jscript/object.htm
function.prototype:
first you define a function. an *empty* prototype object is created like "{}".
later when you use same function to create a new object using the new operator.
every thing that is in .prototype overrides the funtion properties and assigned to the new created object.   
//
usualy the current *this* variable is referenced to the last object created with "new" 
when going into a sub function *this* resets to *this* variable of the module (*this* of the script file)
when you do var x={} it means  var x= new Object();
when you do var x=[] it means  var x= new Array(); // notice you create object with *new* operator

techniqe of "loosing" *this* to - wrap some code inside an anonymus function:
function server() {
 function test(){  
 /// this. // this *this* is of server funvction object
 (function(){ this. })() // wrapper function - this is the trick.  // that *this* is of module 
 }
}
//
techniqe of saving this: 
you see here callback inside a callback. a privet variable passed by reference.
function server() {
   function add( data , callback )  {
     var that=this;
     that.beforeadd( data , function (){ 
      that.doadd( data , function (){ 
       that.afteradd( data , function (){ 
        if(callback)callback(); } ); } ); } );
    }}

to publish avariable you do:
var x;
this.x=x; // now x is is public 

to change the this object you call:
func.call(new_this,arg1,arg2) or func.apply(new_this,[arg1,arg2])
//in general this allows to call public functions as privet.

to see current variables in current *this* object you can call:
sys.puts('this of palce1 ');for( x in this) sys.puts(x); sys.puts('/this of palce1 ');
//
to make async code you just use callback at the end, as the *add* function above.
//
http://github.com/dantebronto/picard - see async example to learn what is async
http://github.com/cramforce/node-asyncEJS/blob/master/lib/asyncEJS.js - base for templates
