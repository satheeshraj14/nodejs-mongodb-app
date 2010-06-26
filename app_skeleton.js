var _ = require('merger');  //  lets do: _.extend(same,otherobjexts),  _.clone(obj) - creates new reference, see source to understand // 
var sys = require('sys'); 
var doubletemplate = require('deps/nodejs-meta-templates/doubletemplate');  //load double teplate module


function App()
{
    var app=this;
    this.server={port:8000};
    this.websocket={port:8000};
    this.database={name:'test',server:'localhost',port:27017};
    this.models={};
    this.urls=[]; // {before:, action:, after:}
    this.templates={}; // {before:, action:, after:}
    this.menus={}; // {before:, action:, after:}
    this.collections={};

    this.defaultvalidation=function ()
    {
     return {valid:true,message:''};
    }
    
    this.template=
    {
     
    } 
        
    this.defaultfield= 
      {
       general:        { caption : 'id', ftype : 'string', size : '20',  primerykey : false, page : 1, autoupdatevalue : null, /* initial value */ },
       list:           { use: true, agregate : null, width : null, wrap : true, quicksearch: true, extsearch: false, },
       view:           { use: true, title: null,                 ftype: 'text', /* text / image */ },
       edit:           { use: true, title: null, readonly:false, ftype: 'text', /* text / password / radio / checkbox / select / textarea / file / hidden */ },
       add:            { use: true, defaultvalue: '', },
       multiupdate:    { use: true, },
       advancedsearch: { use: true, operator1: 'like', operator2:'like', /*  user select / > / < / >= / <= / between / like / not like / starts with / ends with */ },
       viewtag:        {
        div:   { use:false, bold: false, italic : false, align: 'right', /* right / left / center */ direction: '',  /* '' / ltr / rtl */   attributes: '', /* right / left / center */ },
        image: { height: 0, width: 0, resize: false, alt:'', align: 'right', /* right / left / center */ attributes: '', },
        link:  { prefix: '', suffix: '', herffield: "", /* name of a field */ originalvalue: false, },
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
    
    this.basicpage=
    {
     "model":app.models.mainpage,
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
    };

    function prepeare_template(data)
    {
     //this.html
    };
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
     general:
     {
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
     del: function( id )
     {  
     },
     edit: function( where )
     {
      
     },
     list: function(page)
     {
      var that=this;
      that.beforelist( data , function (){ 
       that.dolist( data , function (){ 
        that.afterlist( data , function (){ 
         if(callback)callback(); } ); } ); } );
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
     dodel: function( id )
     {
      
     },
     doedit: function( where )
     {
      
     },
     dolist: function(data ,callback )
     {
      this.collection.insert(data,function (err,doc){ 
       if(err) throw err;
       //sys.puts('sucsess');
       //sys.puts(JSON.stringify(doc) );
      });
      if(callback) callback();
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
     afterlist: function(page)
     {
      if(callback)callback();
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
     // end after event functions //////////////
     // before event functions //////////////
     beforeadd: function( where , callback )
     {
      if(callback)callback();
     },
     beforedel: function( id )
     {
      
     },
     beforeedit: function( where )
     {
      
     },
     beforelist: function(page)
     {
      
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
     // end before event functions //////////////
          
     
    };
}

var app = new App();
this.app = app;