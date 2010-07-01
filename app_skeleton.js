var _ = require('merger');  //  lets do: _.extend(same,otherobjexts),  _.clone(obj) - creates new reference, see source to understand // 
var sys = require('sys'); 
var doubletemplate = require('deps/nodejs-meta-templates/doubletemplate');  //load double teplate module

/*

 +tables - collections
  \/
 +model - collection_specs
  \/
     // +view - compose several tables if needed( sub tables to depth) // posible to implement with a model with map reduce etc..
     //  \/  
     //
     // -meshup_of_models //put several tables here and inter connect them, but indead not required
     //  \/
     // pages - bunch of pages for a meshup_of_models from templates
 +pages - bunch of pages for a model from templates
  \/
 +templates - bunch of pages for a models_meshup
  \/
 urls and actions - bunch of pages for a models_meshup
  \/
 requests - bunch of pages for a models_meshup
 
*/

function App()
{
    var app=this;
    this.server={port:8000};
    this.websocket={port:8000};
    this.templates_path=__dirname+'/templates/';
    this.database={name:'test',server:'localhost',port:27017};
    this.models={};
    this.urls_route_before=[];
    this.url_routes=[];
    this.url_routes_after=[];
    this.pages=[]; // {before:, action:, after:}
    this.templates={}; // {before:, action:, after:}
    this.menus={}; // {before:, action:, after:}
    this.collections={};

    this.defaultvalidation=function ()
    {
     return {valid:true,message:''};
    }
 
    this.defaultfield= 
      {
      
       collections_meshup:        {},
       
       general:        { caption : 'id', ftype : 'string', size : '20',  primerykey : false, page : 1, autoupdatevalue : null, /* initial value */ },
       list:           { use: true, agregate : null, width : null, wrap : true, quicksearch: true, extsearch: false, tempalte:null /* null or custom template function or file name etc */, },
       view:           { use: true, title: null,                 ftype: 'text', /* text / image */ },
       edit:           { use: true, title: null, readonly:false, ftype: 'text', /* text / password / radio / checkbox / select / textarea / file / hidden */ },
       add:            { use: true, defaultvalue: '', },
       multiupdate:    { use: true, },
       advancedsearch: { use: true, operator1: 'like', operator2:'like', /*  user select / > / < / >= / <= / between / like / not like / starts with / ends with */ tempalte:null /* null or custom template function orfile name etc */, },
       viewtag:        {
        div:   { use:false, bold: false, italic : false, align: 'right', /* right / left / center */ direction: '',  /* '' / ltr / rtl */   attributes: '', /* right / left / center */ },
        image: { height: 0, width: 0, resize: false, alt:'', align: 'right', /* right / left / center */ attributes: '', },
        link:  { prefix: '', suffix: '', herffield: "", /* name of a field */ originalvalue: false, },
        tempalte:null /* null or custom template function or file name etc */,
       },
       edittag:        {
        text:      { size: 30, maxlenth: null, attributes: '', lookup: false, }, 
        password:  { size: 30, maxlength: null, attributes: '', }, 
        radio:     { attributes: '', lookup: false, }, 
        checkbox:  { attributes: '', lookup: false, },
        select:    { size: 1,  multiple : false, attributes: '', lookup: false, }, 
        textarea:  { cols: 48,  rows: 4, attributes: '', dhtml: false, }, 
        file:      { size: 30, attributes: '', resizeimage: false, resizeheight: 0, resizewidth: 0, resizetype: 'jpg', /* jpg / png*/ }, 
        hidden:    { customvalue: '', attributes: '', },
        validation:{ validate: false, type:'' /* date/phone... */, regex:'', required:false,  errormessage: '', /* addition to error mesage */ userfunc:app.defaultvalidation, },
        lookup:    { values: {}, /* key-value object array */ usetable: false, tablename: '', linkfield: '', displayfield: '', displayfield2: '', orderby: '', ascdesc: '', /* '' / asc / desc */ filter: '', distinct: false, filterfiled: '', parentfiled: '', },
        tempalte:null /* null or custom template function or file name etc */,
       },
      }  /* end filed */; 
     

    this.basicfields=
    {
      id:     _.extend(app.defaultfield,{general:{caption : 'id', pimerykey:true, ftype : 'number'},add:{use:false},edit:{use:false,readonly:true}}) ,
      normal: _.extend(app.defaultfield,{general:{}}),
    };
    this.header= function ()
    {
      return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'+
      '<html><head><title>Application Editor</title>'+
      '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'+
      '</head><body>'+
      '<div class="ktLayout">'
      '<!-- header (begin) -->'+
      '<div class="ktHeaderRow"><img src="logo.png" alt="" border="0"></div>'+
      '<!-- header (end) -->'+
      '<!-- content (begin) -->'+
      '<table cellspacing="0" class="ktContentTable">'+
       '<tr>'+
        '<td class="ktMenuColumn">'+
        '<!-- left column (begin) -->'+
        '<?php include "ktmenu.php" ?>'+
        '<!-- left column (end) -->'+
        '</td>'+
	    '<td class="ktContentColumn">'+
	    '<!-- right column (begin) -->'+
	     '<p class="nodejsmaker"><b>Application Editor</b></p>';
    }
    this.footer= function ()
    {
      return '<p>&nbsp;</p>'+			
'<!-- right column (end) -->'+
'</td>'+
'</tr>'+
'</table>'+
'<!-- content (end) -->'+
'<!-- footer (begin) -->'+
'<div class="ktFooterRow">'+
'<div class="ktFooterText">&nbsp;&copy;2009 чег иеб</div>'+	
'</div>'+
'<!-- footer (end) -->'+	
'</div>'+
'<div align=center id="session_upkeep"><iframe height="400" width="140" border="0" frameborder="no" src="site_sessionkeep.php"></iframe></div>'+        
'</body>'+
'</html>';
    }

    /*
    this.template=function(name) // html, prepeare
    {
     return  
     {
      //"model":app.models.mainpage,
      "main":function(req,res)
      {
       var data={};
       data.name='muhahahahaha';
       res.writeHead(200, { 'Content-Type': 'text/html' } );
        res.write(this.templates['main'](req,res,data));
       //res.write(this.templates['main'].call(app.models.mainpage,req,res,data));
       res.end();
      },
      templates_data:
      {
       main:' hello <?=name?>',
      },
      templates:
      {
       main:function (req,res,data) { var name =data.name; return 'hello '+name },
      },
     }
    };
*/

    this.basicmodel=
    {

     collection:null, //handle to main mongodb collection
     links:[], //handle to main mongodb collection
     general:
     {
      urlprefix:'model',
      use:true,
      name:'list',
      load_collections:[], //names of mongodb collection to also load
      title:'List',
      filter: null,
      sort: null,
      main: false,
      menu_item: true,
     },
     list:
     {
      use:false,
      inline_add:false,
      inline_copy:false,
      inline_edit:false,
      grid_edit:false,
      must_search:false,
     },
     view:
     {
      use:false,
     },
     add:
     {
      add:true,
      copy:false,
      captcha:false,
      confirm:false,
     },
     del:
     {
      use:false,
      confirm:true,
     },
     edit:
     {
      edit:true,
      confirm:false,
     },
     multiupdate:
     {
      use:false,
      confirm:true,
     },
     search:
     {
      quick:true,
      advanced:false,
      hightlight:false,
     },
     audit:
     {
      use:false,
     },
     email:
     {
      onadd:false,
      onedit:false,
      ondelete:false,
     },
     fields:
     {
     },
     // useful utility functions //////////////
     add: function( data , callback )
     {
      var that=this;
      that.beforeadd( data , function (){ 
       that.doadd( data , function (){ 
        that.afteradd( data , function (){ 
         if(callback)callback(); } ); } ); } );
     },
     
     del: function( where, callback )
     {  
      var that=this;
      that.beforedel( data , function (){ 
       that.dodel( data , function (){ 
        that.afterdel( data , function (){ 
         if(callback)callback(); } ); } ); } );     
     },
     
     edit: function( where )
     {
      
     },
     
     list: function( where , callback)
     {
      var that=this;
      that.beforelist( where , function (where1)
      { 
       that.dolist( where1 , function (where2,cursor2)
       {
        that.afterlist( where2 , cursor2, function (cursor3)
        { 
         if(callback)callback(cursor3);
        } );
       } );
      } );
     },
     multiupdate: function( where )
     {
      
     },
     report: function( where )
     {
      
     },
     search: function( where )
     {
      
     },
     view: function( where )
     {
      
     },
     save: function( data )
     {
      
     },
     addpages: function(callback)
     {
      var that=this;
      that.beforeaddpages(  function (){ 
       that.doaddpages( function (){ 
        that.afteraddpages( function (){ 
         if(callback)callback(); } ); } ); } );  
     },
     addurls: function(callback)
     {
      var that=this;
      that.beforeaddurls(  function (){ 
       that.doaddurls( function (){ 
        that.afteraddurls( function (){ 
         if(callback)callback(); } ); } ); } );  
     },

     init: function(callback)
     {
      var that=this;
      that.beforeinit(  function (){ 
       that.doinit( function (){ 
        that.afterinit( function (){ 
         if(callback)callback(); } ); } ); } );  
     },

     setupfirst: function(callback)
     {
      var that=this;
      that.beforesetupfirst(  function (){ 
       that.dosetupfirst( function (){ 
        that.aftersetupfirst( function (){ 
         if(callback)callback(); } ); } ); } );  
     },
     setup: function(callback)
     {
      var that=this;
      that.beforesetup(  function (){ 
       that.dosetup( function (){ 
        that.aftersetup( function (){ 
         if(callback)callback(); } ); } ); } );  
     },
     setuplast: function(callback)
     {
      var that=this;
      that.beforesetuplast(  function (){ 
       that.dosetuplast( function (){ 
        that.aftersetuplast( function (){ 
         if(callback)callback(); } ); } ); } );  
     },
           
     // end useful utility functions //////////////
     // real action functions //////////////
     doadd: function( data ,callback )
     {
      this.collection.insert(data,function (err,doc){ 
       if(err) throw err;
       //sys.puts('sucsess');
       //sys.puts(JSON.stringify(doc) );
      });
      if(callback) callback();
     },
     
     dodel: function( where, callback )
     {
      this.collection.remove( where, function (err,doc){ 
       if(err) throw err;
       //sys.puts('sucsess');
       //sys.puts(JSON.stringify(doc) );
      });
      if(callback) callback();
     },
     
     doedit: function( where )
     {
      
     },
     dolist: function(where , callback )
     {
	  // http://www.mongodb.org/display/DOCS/Querying
	  // http://www.mongodb.org/display/DOCS/Queries+and+Cursors
	  // http://www.mongodb.org/display/DOCS/Advanced+Queries
	  // http://www.mongodb.org/display/DOCS/Optimization
		 
	  // to joins replace this method with something like db.runCommand((function () { mongodbcode }).toSource )
	  // http://github.com/mongodb/mongo/blob/master/jstests/mr1.js
	  // http://github.com/mongodb/mongo/blob/master/jstests/mr2.js 
	  // http://www.mongodb.org/display/DOCS/MapReduce
	  // http://www.mongodb.org/display/DOCS/Aggregation
	  // http://rickosborne.org/blog/index.php/2010/02/09/infographic-migrating-from-sql-to-mapreduce-with-mongodb/
	  // http://rickosborne.org/download/SQL-to-MongoDB.pdf
	  // http://rickosborne.org/blog/index.php/2010/02/08/playing-around-with-mongodb-and-mapreduce-functions/
		 
      this.collection.find(
      function(err, cursor)
      {
       if(err) throw err;
       else 
       {
        if(callback) callback(cursor);
       }
      });
      
      // iterating thru cursor:
      //  cursor.each(function(err, item) {
      //    if(item != null) sys.puts(sys.inspect(item));
      //  });

     },
     domultiupdate: function( where )
     {
      
     },
     doreport: function( where )
     {
      
     },
     dosearch: function( where )
     {
      
     },
     doview: function( where )
     {
      
     },
     dosave: function( data )
     {
      
     },
     doaddpages: function (callback)
     {
      for(p in this.pages)
      {
       this.pages[p].model=this;
       // load templates
       for(t in this.pages[p].load_templates)
       {
        var template_file=this.pages[p].load_templates[t];
        var data={'page':this.pages[p],'model':this,'app':app};
        this.pages[p][t]=doubletemplate.loadtemplate(app.templates_path+template_file,data)
       }
       // prepeare templates
       for(t in this.pages[p].prepeare_templates)
       {
        // here we do closure to bound the function this this.
        var that=this;
        var template_function=function (data){(that.pages[p].prepeare_templates[t])(data)};
        var data={'page':this.pages[p],'model':this,'app':app};
        this.pages[p][t]=doubletemplate.prepeare(template_function,data);
       }
       
       //doubletemplate
      }
      if(callback)callback(callback);
     },
     doaddurls: function (callback)
     {
      // adlater calling route before, route after
      for(p in this.pages)
      { 
       var pageurl='/'+this.general.urlprefix+this.pages[p].pageurl;
       //app.url_routes.push({path:pageurl,code:function(req,res,page,callback){res.writeHead(200, { 'Content-Type': 'text/plain'});res.write('hello world');res.end();}});
       app.url_routes.push({path:pageurl,page:this.pages[p]});
      }
      if(callback)callback(callback);
     },
     doinit: function( data )
     {
      this.addpages();
      this.addurls();
     },
     dosetupfirst: function( data )
     {

     },
     dosetup: function( data )
     {
      this.init();
     },
     dosetuplast: function( data )
     {

     },
     // end real action functions //////////////
     // after event functions //////////////
     afteradd: function( where , callback )
     {
      if(callback)callback();
     },
     afterdel: function( id )
     {
      
     },
     afteredit: function( where )
     {
      
     },
     afterlist: function(where , cursor, callback)
     {
      if(callback)callback(cursor);
     },
     aftermultiupdate: function( where )
     {
      
     },
     afterreport: function( where )
     {
      
     },
     aftersearch: function( where )
     {
      
     },
     afterview: function( where )
     {
      
     },
     aftersave: function( data )
     {
      
     },
     afteraddpages: function(callback)
     {
      if(callback)callback();
     },
     afteraddurls: function(callback)
     {
      if(callback)callback();
     },
     afterinit: function(callback)
     {
      if(callback)callback();
     },
     
     aftersetupfirst: function(callback)
     {
      if(callback)callback();
     },
     aftersetup: function(callback)
     {
      if(callback)callback();
     },
     aftersetuplast: function(callback)
     {
      if(callback)callback();
     },
     // end after event functions //////////////
     // before event functions //////////////
     beforeadd: function( where , callback )
     {
      if(callback)callback();
     },
     beforedel: function( where , callback )
     {
      if(callback)callback();
     },
     beforeedit: function( where )
     {
      
     },
     beforelist: function(where,callback)
     {
      if(callback)callback();
     },
     beforemultiupdate: function( where )
     {
      
     },
     beforereport: function( where )
     {
      
     },
     beforesearch: function( where )
     {
      
     },
     beforeview: function( where )
     {
      
     },
     beforesave: function( data )
     {
      
     },
     beforeaddpages: function(callback)
     {
      if(callback)callback();
     },
     beforeaddurls: function(callback)
     {
      if(callback)callback();
     },
     beforeinit: function(callback)
     {
      if(callback)callback();
     },
     beforesetupfirst: function(callback)
     {
      if(callback)callback();
     },
     beforesetup: function(callback)
     {
      if(callback)callback();
     },
     beforesetuplast: function(callback)
     {
      if(callback)callback();
     },
     // end before event functions //////////////
     pages:
     {
      list:
      {
       pageurl:'/list.jsp',
       // add error on existing function
       
       load_templates:  // texts treated as templates toload and prepeare
       {
        list:"default/list.html",
        //this.template2(data),
        //this.template2(data),
        //function template2(var){...}, // function template to be prepeared here instantly= bad idea
       }, // to add templates later use: this.templates.template2=this.template2(data) ...
       
       prepeare_templates:  // texts treated as templates toload and prepeare
       {
        //template2:function template2(var){...}, // function template to be prepeared here instantly= bad idea
       }, // to add templates later use: this.templates.template2=this.template2(data) ...
       
       // will be here: this.list=function(){...
       // will be here: this.template2=function(){...
       //list:function (){}, 

       main:function (req,res,page,callback)
       {
        res.writeHead(200, { 'Content-Type': 'text/plain'});
     
        //var currentpage=request.querystring['page']
        var x;
        x=page.model.list();
        
        data={'name':sys.inspect(x)};//;
        res.write(this.list(data));
        res.end();
       },
      }, // end page
     },
     
        
     
    };
}

var app = new App();
this.app = app;