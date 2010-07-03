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
    this.doubletemplate=doubletemplate;
    
    this.database={name:'test',server:'localhost',port:27017};
    this.models={};
    this.urls_route_before=[];
    this.url_routes=[];
    this.url_routes_after=[];  
    this.master_templates_cache
    this.pages=[]; 

    this.menus={}; 
    this.collections={};
    
    this.templates= // master templates
    {
     load_templates:  // texts treated as templates filenames to load and prepeare
     {
      admin:"admin.html",
     },
     
     prepeare_templates:  // function treated as templates function to prepeare
     {
      //template2:function template2(var){...}, // function template to be prepeared here instantly= bad idea
     },
    };
    
    this.editfields= // master templates
    {
     load_templates:  // texts treated as templates filenames to load and prepeare
     {
      checkbox:"editfields/checkbox.html",
      date:"editfields/date.html",
      file:"editfields/file.html",
      hidden:"editfields/hidden.html",
      image:"editfields/image.html",
      number:"editfields/number.html",
      password:"editfields/password.html",
      radio:"editfields/radio.html",
      select:"editfields/select.html",
      text:"editfields/text.html",
      textarea:"editfields/textarea.html",     
     },
     
     prepeare_templates:  // function treated as templates function to prepeare
     {
      //template2:function template2(var){...}, // function template to be prepeared here instantly= bad idea
     },
     
     // there is no data to templates of the 1st step
     //prepere_data:function (template_name) {  return {'app':app};},
     
    };
    
    this.viewfields= // master templates
    {
     load_templates:  // texts treated as templates filenames to load and prepeare
     {
      div:"viewfields/div.html",
      link:"viewfields/link.html",
      image:"viewfields/image.html",
      //additional might be good idea
      checkbox:"viewfields/checkbox.html",
      date:"viewfields/date.html",
      file:"viewfields/file.html",
      hidden:"viewfields/hidden.html",
      //image:"viewfields/image.html",
      number:"viewfields/number.html",
      password:"viewfields/password.html",
      radio:"viewfields/radio.html",
      select:"viewfields/select.html",
      text:"viewfields/text.html",
      textarea:"viewfields/textarea.html",     
     },
     
     prepeare_templates:  // function treated as templates function to prepeare
     {
      //template2:function template2(var){...}, // function template to be prepeared here instantly= bad idea
     },

     // there is no data to templates of the 1st step
     //prepere_data:function (template_name) {  return {'app':app};},
    };
    
   
    this.load_templates = function (templates_object)
    {  
       
       templates_object.load=function(tempalte_name,template_file,data2)
       {
        // data1 might need clone here , but seems not needed because wil never changed from inside template
        var data1=templates_object.prepere_data(tempalte_name,tempalte_name);
        if(typeof data2 === 'undefined' && typeof data1 !== 'undefined')
         data2={};
        if(typeof data2 !== 'undefined')
         _.add(data2,data1);
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.loadtemplate(app.templates_path+template_file,templates_object,data2);
       }
       templates_object._=_;
       
       templates_object.load1=function(tempalte_name,template_file)
       {
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object);
       }
       
       var data,tempalte_name,template_file;
       // load templates
       for(tempalte_name in templates_object.load_templates)
       {
        data=templates_object.prepere_data(templates_object,tempalte_name);
        template_file=templates_object.load_templates[tempalte_name];
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.loadtemplate(app.templates_path+template_file,templates_object,data)
       }
                
       // prepeare function templates
       for(tempalte_name in templates_object.prepeare_templates)
       {
        data=templates_object.prepere_data(templates_object,tempalte_name);
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.prepeare(templates_object.prepeare_templates[tempalte_name],'function/'+tempalte_name,templates_object,data);
       }
    }
    
   
    this.load_templates1 = function (templates_object)
    {
       templates_object.load=function(tempalte_name,template_file)
       {
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object);
       }
       templates_object._=_;
       
       var tempalte_name;
       // load templates
       for(tempalte_name in templates_object.load_templates)
       {
        var template_file=templates_object.load_templates[tempalte_name];
        if(templates_object[tempalte_name])
         throw {name:'UserException',message:'template '+tempalte_name+' already exists.'};
        else
         templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object)
       }
    }
    
    this.load_app_templates=function (callback)
     {
      this.load_templates1(this.templates);
      this.load_templates1(this.editfields);
      this.load_templates1(this.viewfields);      
      if(callback)callback(callback);
     };
    

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
        text:      { size: 30, maxlength: null, attributes: '', lookup: false, }, 
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
      id:     _.extend(_.clone(app.defaultfield),{general:{caption : 'id', pimerykey:true, ftype : 'number'},add:{use:false},edit:{use:false,readonly:true}}) ,
      normal: _.extend(_.clone(app.defaultfield),{general:{}}),
    };
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
      that.beforelist( where , function ()
      {
          
       that.dolist( where , function (cursor)
       {  
        that.afterlist( where , cursor, function (cursor2)
        { 
         if(callback){ callback(cursor2); }
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
      var p,tempalte_name,template_function;
      for(p in this.pages)
      {
       var page=this.pages[p];
       //add .model reference to page
       page.model=this;      
       app.load_templates(page);

      }
      if(callback)callback(callback);
     },
     doaddurls: function (callback)
     {
      var p;
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
      list:require('templates/default/list').page.call(this,app,this), // end page
      add:require('templates/default/add').page.call(this,app,this), // end page
     },
     
        
     
    };
}

var app = new App();
this.app = app;