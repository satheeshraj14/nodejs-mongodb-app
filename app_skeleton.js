var _ = require('deps/nodejs-clone-extend/merger');  //  lets do: _.extend(same,otherobjexts),  _.clone(obj) - creates new reference, see source to understand // 
var sys = require('sys');
var doubletemplate = require('deps/nodejs-meta-templates/doubletemplate');  //load double teplate module
var httputils = require('httputils');
var ObjectID= require('deps/node-mongodb-native/lib/mongodb/bson/bson').ObjectID;
var step=require('deps/step/lib/step');
var phpjs = require('phpjs'); // http://phpjs.org/packages/view/2693/name:806d77a73ce93d851a4620f4a788acd7

var autoreload= require('deps/node-hot-reload');
autoreload.path=__dirname;

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
 +urls and actions - bunch of pages for a models_meshup
  \/
 +requests - bunch of pages for a models_meshup - // missing to rewrite to comp
 
*/

function App()
{
    this.autoreload=autoreload;
	this._=_;
	this.phpjs=phpjs;
    var app=this;
    this.server={port:8000};
    this.websocket={port:8000};
    this.templates_path=__dirname+'/templates/';
    this.doubletemplate=doubletemplate;
    this.httputils=httputils;
    this.ObjectID=ObjectID;
    this.step=step;
    this.sys=sys;
    
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
     pagefilename:__filename,
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
     pagefilename:__filename,
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
      html:"editfields/html.html",     
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
     pagefilename:__filename,
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
      html:"viewfields/html.html",     
     },
     
     prepeare_templates:  // function treated as templates function to prepeare
     {
      //template2:function template2(var){...}, // function template to be prepeared here instantly= bad idea
     },

     // there is no data to templates of the 1st step
     //prepere_data:function (template_name) {  return {'app':app};},
    };
    
   
   
    this.load_templates = function (templates_object,callback)
    {

       templates_object.htmlencode=doubletemplate.htmlencode;
       
       templates_object.load=function(tempalte_name,template_file,data2)
       {
        // data1 might need clone here , but seems not needed because wil never changed from inside template
        templates_object.prepere_data(templates_object,tempalte_name,
         function(data1)
         {
          if(typeof data2 === 'undefined' && typeof data1 !== 'undefined')
           data2={};
          if(typeof data2 !== 'undefined')
           _.add(data2,data1);
          if(templates_object[tempalte_name])
           throw new Error('template '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+' already exists.');
          else
          {
           //console.log('load template1 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+'.');
           templates_object[tempalte_name]=doubletemplate.loadtemplate(app.templates_path+template_file,templates_object,data2);
          }
         }        
        );
       }
       templates_object._=_;
       
       templates_object.load1=function(tempalte_name,template_file)
       {
        if(templates_object[tempalte_name])
         throw new Error('template '+(templates_object.pagefilename?templates_object.pagefilename:'')+tempalte_name+' already exists.');
        else
        {
         templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object);
         //console.log('load template2 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+'.');
        }
       }
       
       var data,tempalte_name,template_file;
       // load templates
       var countcallback=0;// count inner loops until callback
       countcallback++;//one more for this function;
       if(templates_object.load_templates)
       _.foreach(templates_object.load_templates,
       function (template_file,tempalte_name)
       {
         countcallback++;
         templates_object.prepere_data(templates_object,tempalte_name, function(data)
         {
          if(templates_object[tempalte_name])
           throw new Error('template3 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+' already exists.'+' model:'+(templates_object.model?templates_object.model.modelname:''));
          else
          {
           /*
           //// debug template redifinition: (uncomment then recomment) 
           if((templates_object.pagefilename?templates_object.pagefilename:'')=='/var/www/nodejs-mongodb-app/templates/default/add.js'&& tempalte_name=='content')
           {
            try
            { 
             throw new Error('load_template trace '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+' model:'+(templates_object.model?templates_object.model.modelname:''));
            }
            catch (e) { console.log(e.stack); }
           }
           //// end debug template redifinition:
           */ 
           //console.log('load template3 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+' model:'+(templates_object.model?templates_object.model.modelname:''));
           templates_object[tempalte_name]=doubletemplate.loadtemplate(app.templates_path+template_file,templates_object,data)
          }
          countcallback--;
          if(countcallback==0) {if(callback)callback(); }
         }
        );
       },this);
       
                
       // prepeare function templates
       if(templates_object.prepeare_templates)
       _.foreach(templates_object.prepeare_templates,
       function (template_file,tempalte_name)
       {
        countcallback++;
        templates_object.prepere_data(templates_object,tempalte_name,function (data)
        {
         if(templates_object[tempalte_name])
          throw new Error('template '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+' already exists.');
         else
         {
          //console.log('load template4 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+'.');
          templates_object[tempalte_name]=doubletemplate.prepeare(template_file,'function/'+tempalte_name,templates_object,data);
         }
         countcallback--;
         if(countcallback==0) if(callback)callback();
        });
       }
       ,this);
       countcallback--;
       if(countcallback==0) {if(callback)callback(); }
    }
    
    this.load_templates1 = function (templates_object)
    {
       //   console.log(templates_object.pagefilename);
       templates_object.htmlencode=doubletemplate.htmlencode;
       
       templates_object.load=function(tempalte_name,template_file)
       {
        if(templates_object[tempalte_name])
         throw new Error('template '+tempalte_name+' already exists.');
        else
        {
          //console.log('load template5 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+'.');
          templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object);
        }
       }
       templates_object._=_;
       
       var tempalte_name;
       // load templates
       if(templates_object.load_templates)
       _.foreach(templates_object.load_templates,
       function (template_file,tempalte_name)
       {
        var template_file=templates_object.load_templates[tempalte_name];
        if(templates_object[tempalte_name])
         throw new Error('template '+tempalte_name+' already exists.');
        else
         {
          //console.log('load template6 '+(templates_object.pagefilename?templates_object.pagefilename:'')+' - '+tempalte_name+'.');
          templates_object[tempalte_name]=doubletemplate.loadtemplate1(app.templates_path+template_file,templates_object)
         }
       },this);
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
    
    
    this.prepare_subitems_lists = function (main_model)
    {
     //sys.puts(sys.inspect(main_model));
     var operation,operations=['edit','view'];
     var operations_copy={'list':'view','add':'edit','multiupdate':'edit','advancedsearch':'edit'};
     var arrselections,fieldname,havelookup,lookupinfo,field,operations_type;
     
     main_model.prep_subitems={};
     
     for(var i=0;i<operations.length;i++)
     {
      operation=operations[i];
      arrselections=[];
      operations_type=operation;
           if(operation=='view')           operations_type='view';
      else if(operation=='list')           operations_type='view';
      else if(operation=='add')            operations_type='edit';
      else if(operation=='multiupdate')    operations_type='edit';
      else if(operation=='advancedsearch') operations_type='edit'; // add searchtags later
      for(fieldname in main_model.fields)
      {
       if(!main_model.fields[fieldname]) console.log('field \''+main_model.general.name +','+fieldname+'\' not found')
       field=main_model.fields[fieldname];

       if(operations_type=='view')
       {
        if(typeof field.viewtag[
         field[operations_type].ftype
        ].lookup===null)
        {
         havelookup=field.edittag[
          field['edit'].ftype
         ].lookup
         ?true:false;
         if(havelookup)
          lookupinfo=field.edittag.lookup;
        }
        else
        {
         havelookup=field.edittag[
          field[operations_type].ftype
         ].lookup
         ?true:false;
         if(havelookup)
         {
          if(field.viewtag.lookup.sameasedit)
           lookupinfo=field.edittag.lookup;
          else
          {
           lookupinfo=field.viewtag.lookup;
          } 
         }
        }
       }
       else
       {
        //sys.puts(operations_type);
        //sys.puts(sys.inspect(field));
        havelookup=field.edittag[ field[operations_type].ftype  ].lookup?true:false;
        if(havelookup)
        {
         lookupinfo=field.edittag.lookup;
        }
       }
        
       if(havelookup)
       {
        arrselections.push({where:(lookupinfo.where?lookupinfo.where:false), submodel:app.models[lookupinfo.tablename],'fieldname':fieldname,cursor:[],'lookupinfo':lookupinfo});
       }
      }
      
      main_model.prep_subitems[operation]=arrselections;
     }
       
     
     var source,target;
     for(target in operations_copy)
     {
      source=operations_copy[target];
      main_model.prep_subitems[target]=main_model.prep_subitems[source];
     }
     //sys.puts(sys.inspect(main_model.prep_subitems));
    }

    this.fake_load_data= function(items_to_load,retdata,callback)
    {
             var call_count=0;
             if(!items_to_load)
             {
              retdata={};
              callback();  // don't create group_slots if the array is empty otherwise it will not go to the next step
             }
             else
             {
              for(var items_to_load_key2 in items_to_load)
              {
               if(items_to_load.hasOwnProperty(items_to_load_key2))
               {
                var info_of_model_to_load2=items_to_load[items_to_load_key2];
                call_count++;
                (function(info_of_model_to_load,items_to_load_key) {
                process.nextTick(function ()
                {
                      var loaded_subitems={},items={};
                      //
                      retdata['item_name']                     = items_to_load_key;
                      retdata[items_to_load_key]              = _.clone(info_of_model_to_load.empty_object);
                      //
                      //sys.puts(sys.inspect(info_of_model_to_load))
                      retdata['error_name']                      = 'error_'       +items_to_load_key;
                      retdata['error_'      +items_to_load_key]   = null;
                      //
                      retdata['cursor_name']                     = 'cursor_'      +items_to_load_key;
                      retdata['cursor_'      +items_to_load_key]  = items;
                      //
                      if(info_of_model_to_load.load_one)
                      {
                       retdata['item_name']                      = items_to_load_key;
                       retdata[items_to_load_key]                = _.clone(info_of_model_to_load.model.empty_object);
                      }
                      //
                      retdata['model_name']                      = 'model_'       +items_to_load_key;
                      retdata['model_'       +items_to_load_key]  = info_of_model_to_load.model;
                      //
                      retdata['sub_cursors_name']                = 'sub_cursors_' +items_to_load_key;
                      retdata['sub_cursors_' +items_to_load_key]  = loaded_subitems;
                      //sys.puts(sys.inspect(   items ));
                      call_count--;  if(call_count==0)     callback();
                      //fs.readFile(__filename, group_slot);
                }); // next tick
                })(info_of_model_to_load2,items_to_load_key2);// subfunction
               }; // if has own
              } //for in
             } // else of empty
       
    };
    
    this.load_data= function(items_to_load,retdata,callback)
    {
             var call_count=0;
             if(!items_to_load)
             {
              retdata={};
              callback();  // don't create group_slots if the array is empty otherwise it will not go to the next step
             }
             else
             {
              for(var items_to_load_key2 in items_to_load)
              {
               if(items_to_load.hasOwnProperty(items_to_load_key2))
               {
                var info_of_model_to_load2=items_to_load[items_to_load_key2];
                call_count++;
                (function(info_of_model_to_load,items_to_load_key) {
                //sys.puts("top model---------------************************************");
                //sys.puts(sys.inspect(info_of_model_to_load,0));
                process.nextTick(function ()
                {
                 var loaded_subitems={},items={};
                 if(info_of_model_to_load.load_subitems && info_of_model_to_load.load_items)
                 { // multi load double
                  app.load_subitems( info_of_model_to_load.model , info_of_model_to_load.column_set , function (loaded_subitems)
                  {
                  info_of_model_to_load.model.select(info_of_model_to_load.where,function (cursor)
                  {
                  cursor.toArray(function(err, items)
                  {
                         //sys.puts("inner model1---------------+++++++++++++++++++++++++++++++++");
                         //sys.puts(sys.inspect(info_of_model_to_load,0));
                         //
                         retdata['error_name']                      = 'error_'       +items_to_load_key;
                         retdata['error_'      +items_to_load_key]  = err;
                         //
                         if(info_of_model_to_load.fill_empty)
                         {
                          for(var i=0;i<items.length;i++)
                          {
                           _.add(items[i],info_of_model_to_load.empty_object);
                          }
                         }
                         //
                         retdata['cursor_name']                     = 'cursor_'      +items_to_load_key;
                         retdata['cursor_'      +items_to_load_key] = items;
                         //
                         if(info_of_model_to_load.load_one)
                         {
                          retdata['item_name']                      = items_to_load_key;
                          retdata[items_to_load_key]                = items.length>0?items[0]:_.clone(info_of_model_to_load.model.empty_object);
                         }
                         //
                         retdata['model_name']                      = 'model_'       +items_to_load_key;
                         retdata['model_'       +items_to_load_key] = info_of_model_to_load.model;
                         //
                         retdata['sub_cursors_name']                = 'sub_cursors_' +items_to_load_key;
                         retdata['sub_cursors_' +items_to_load_key] = loaded_subitems;
                         //
                         //sys.puts(sys.inspect(   items ));
                         call_count--;  if(call_count==0)     callback();
                         //
                  });//toarray
                  });//select
                  });//subitems2
                 }
                 else if(info_of_model_to_load.load_subitems)
                 { // multi load
                   app.load_subitems( info_of_model_to_load.model , info_of_model_to_load.column_set , function (loaded_subitems)
                   {
                         //sys.puts("inner model2---------------+++++++++++++++++++++++++++++++++");
                         //sys.puts(sys.inspect(info_of_model_to_load,0));
                         //sys.puts(sys.inspect(info_of_model_to_load))
                         retdata['error_name']                      = 'error_'       +items_to_load_key;
                         retdata['error_'      +items_to_load_key]  = null;
                         //
                         if(info_of_model_to_load.fill_empty)
                         {
                          for(var i=0;i<items.length;i++)
                          {
                           _.add(items[i],info_of_model_to_load.empty_object);
                          }
                         }
                         //
                         retdata['cursor_name']                     = 'cursor_'      +items_to_load_key;
                         retdata['cursor_'      +items_to_load_key] = items;
                         //
                         if(info_of_model_to_load.load_one)
                         {
                          retdata['item_name']                      = items_to_load_key;
                          retdata[items_to_load_key]                = items.length>0?items[0]:_.clone(info_of_model_to_load.model.empty_object);
                         }
                         //
                         retdata['model_name']                      = 'model_'       +items_to_load_key;
                         retdata['model_'       +items_to_load_key] = info_of_model_to_load.model;
                         //
                         retdata['sub_cursors_name']                = 'sub_cursors_' +items_to_load_key;
                         retdata['sub_cursors_' +items_to_load_key] = loaded_subitems;
                         sys.puts(sys.inspect(   loaded_subitems ));
                         call_count--;  if(call_count==0)     callback();
                         //
                   });//subitems2
                 }
                 else // load select
                 { // single load 
                   info_of_model_to_load.model.select(info_of_model_to_load.where,function (cursor)
                   {
                   cursor.toArray(function(err, items)
                   {
                         //sys.puts("inner model3---------------+++++++++++++++++++++++++++++++++");
                         //sys.puts(sys.inspect(info_of_model_to_load,0));
                         //sys.puts(sys.inspect(info_of_model_to_load))
                         retdata['error_name']                      = 'error_'       +items_to_load_key;
                         retdata['error_'      +items_to_load_key]  = err;
                         
                         if(info_of_model_to_load.fill_empty)
                         {
                          for(var i=0;i<items.length;i++)
                          {
                           _.add(items[i],info_of_model_to_load.empty_object);
                          }
                         }
                         
                         retdata['cursor_name']                     = 'cursor_'      +items_to_load_key;
                         retdata['cursor_'      +items_to_load_key] = items;
                                              
                         if(info_of_model_to_load.load_one)
                         {
                          retdata['item_name']                       = items_to_load_key;
                          retdata[items_to_load_key]                 = items.length>0?items[0]:_.clone(info_of_model_to_load.model.empty_object);
                         }
                         
                         retdata['model_name']                      = 'model_'       +items_to_load_key;
                         retdata['model_'       +items_to_load_key] = info_of_model_to_load.model;
                         
                         retdata['sub_cursors_name']                = 'sub_cursors_' +items_to_load_key;
                         retdata['sub_cursors_' +items_to_load_key] = loaded_subitems;
                         //sys.puts("inner retdata3---------------+++++++++++++++++++++++++++++++++");
                         //sys.puts(sys.inspect(retdata,0));
                         //sys.puts(sys.inspect(   items ));
                         call_count--;  if(call_count==0)     callback();
                         //
                   });//toarray
                   });//select
                 }
                 //fs.readFile(__filename, group_slot);

                }); // next tick
                })(info_of_model_to_load2,items_to_load_key2);// subfunction
               }; // if has own
              } //for in
             } // else of empty
       
    };
    
    this.load_subitems = function (main_model,operation,callback)
    {        //shoud i add static support ? app.load_subitems( page.model , 'static/cached/on change of a specific model(onchange is multi process unsupported)') ? <<should i add this later? 
     if(main_model.prep_subitems[operation].length==0)callback({});
     //sys.puts(main_model.modelname+','+operation);
     //sys.puts(main_model.modelname+"|"+operation+"| "+sys.inspect(main_model.prep_subitems[operation]));     
     var arrselections=_.cloneuptolevel(main_model.prep_subitems[operation],2)
     app.step(
      function ()
      {
       //sys.puts('start get items for a all sub items collection');
       var new_group = this.group();
       //sys.puts(sys.inspect(arrselections,false,1));
       arrselections.forEach(function (selection,i,arr)
       //for(var i=0,l=arrselections.length;i<l;i++)
       {
        //sys.puts('start get items for a subitem collection '+selection.fieldname);
        var ret_group=new_group(); // add + 1 count to wait for results list
        //sys.puts('select sub items: selections.'+selection.fieldname+'.fieldname = '+selection.fieldname);
        if(!selection.where)selection.where=null;
     
        selection.submodel.select(selection.where,function (cursor)
        {
         try{
//          sys.puts('ret list' + sys.inspect(cursor));
         cursor.toArray(function(err, items)
         {
          ///sys.puts('recevied array');
          //sys.puts('received subitems '+selection.fieldname);
          //sys.puts(sys.inspect(items));
          selection.cursor=items;
          ret_group(null,true); 
         });
         }
         catch(e)
         {
          //sys.puts('error in load_subitems');
          //(new_group())(null,true);
          ret_group(null,false);
         }
         
        });
        
       });
       //sys.puts('step 100');
       //this.next();
      },
      function (err, contents)
      {   //     sys.puts('end');
       //if(err)
       // sys.puts('step 200 ='+err);
       //else 
       // sys.puts('step 200 ='+contents);
       err=null;
       //sys.puts(sys.inspect(arrselections))
       var byfield={};
       for(var i=0,l=arrselections.length;i<l;i++)
        byfield[arrselections[i].fieldname]=arrselections[i];
       //if (err) { throw err; }
       arrselections=null;
       callback(byfield);
       
      }
     );
    }
     
    this.defaultfield= 
      {
      
       collections_meshup:        {},
       
       general:        { title : 'id', ftype : 'string', size : '20',  primerykey : false, page : 1, autoupdatevalue : null, /* initial value */ },
       list:           { use: true, agregate : null, width : null, ftype: 'text' /* text / image */, wrap : true, quicksearch: true, extsearch: false, tempalte:null /* null or custom template function or file name etc */, },
       view:           { use: true, title: null,                   ftype: 'text' /* text / image */, },
       edit:           { use: true, title: null, readonly:false,   ftype: 'text' /* text / date / password / radio / checkbox / select / textarea / html / file / hidden */, },
       add:            { use: true, /*default_value: '',*/ },
       multiupdate:    { use: true, },
       advancedsearch: { use: true, operator1: 'like', operator2:'like', /*  user select / > / < / >= / <= / between / like / not like / starts with / ends with */ tempalte:null /* null or custom template function orfile name etc */, },
       viewtag:        {
       
        div:   { use:false, bold: false, italic : false, align: 'right', /* right / left / center */ direction: '',  /* '' / ltr / rtl */   attributes: '' /* right / left / center */,  lookup: null,  },
        image: { height: 0, width: 0, resize: false, alt:'', align: 'right', /* right / left / center */ attributes: '',  lookup: null, },
        link:  { prefix: '', suffix: '', herffield: "", /* name of a field */ originalvalue: false,  lookup: null, },

        text:      { size: 30, maxlength: null, attributes: '', lookup: null, }, 
        password:  { size: 30, maxlength: null, attributes: '', }, 
        radio:     { attributes: '', lookup: null, }, 
        checkbox:  { attributes: '', lookup: null, },
        select:    { size: 1,  multiple : false, attributes: '', lookup: null, }, 
        textarea:  { cols: 48,  rows: 4, attributes: '', },
        html:      { cols: 48,  rows: 4, attributes: '', }, 
        date:     { cols: 48,  rows: 4, attributes: '', },
        file:      { size: 30, attributes: '', resizeimage: false, resizeheight: 0, resizewidth: 0, resizetype: 'jpg', /* jpg / png*/ }, 
        hidden:    { customvalue: '', attributes: '', },
        validation:{ validate: false, type:'' /* date/phone... */, regex:'', required:false,  errormessage: '', /* addition to error mesage */ userfunc:app.defaultvalidation, },
        lookup:    { sameasedit:false, values: {}, /* key-value object array */ usetable: false, tablename: '', linkedfield: '', displayfield: '', displayfield2: '', orderby: '', ascdesc: '', /* '' / asc / desc */ filter: '', distinct: false, filterfield: '', parentfield: '', },
        tempalte:false /* null or custom template function or file name etc */,
       },
       edittag:        {
        text:      { size: 30, maxlength: null, attributes: '', lookup: false, }, 
        password:  { size: 30, maxlength: null, attributes: '', }, 
        radio:     { attributes: '', lookup: false, }, 
        checkbox:  { attributes: '', lookup: false, },
        select:    { size: 1,  multiple : false, attributes: '', lookup: false, }, 
        textarea:  { cols: 48,  rows: 4, attributes: '', },
        html:      { cols: 48,  rows: 4, attributes: '', },
        date:     { cols: 48,  rows: 4, attributes: '', }, 
        file:      { size: 30, attributes: '', resizeimage: false, resizeheight: 0, resizewidth: 0, resizetype: 'jpg', /* jpg / png*/ }, 
        hidden:    { customvalue: '', attributes: '', },
        validation:{ validate: false, type:'' /* date/phone... */, regex:'', required:false,  errormessage: '', /* addition to error mesage */ userfunc:app.defaultvalidation, },
        lookup:    {                   values: {}, /* key-value object array */ usetable: false, tablename: '', linkedfield: '', displayfield: '', displayfield2: '', orderby: '', ascdesc: '', /* '' / asc / desc */ filter: '', distinct: false, filterfield: '', parentfield: '', },
        tempalte:false /* null or custom template function or file name etc */,
       },
      }  /* end field */; 
     

    this.basicfields=
    {
      _id:     _.cloneextend(app.defaultfield,{general:{title : 'id', pimerykey:true, ftype : 'number'},add:{use:false},edit:{use:false,readonly:true}}) ,
      normal: _.cloneextend(app.defaultfield,{general:{}}),
    };
    this.basicfields.textarea = _.cloneextend(app.basicfields.normal, { edit:{ftype:'textarea'}});
    this.basicfields.html     = _.cloneextend(app.basicfields.normal, { edit:{ftype:'html'}});
    this.basicfields.date     = _.cloneextend(app.basicfields.normal, { edit:{ ftype:'date'}});
    this.basicfields.number   = _.cloneextend(app.basicfields.normal, { edittag: { validation: { validate: false, type: 'number'} }, general: { ftype: 'number'} });
    this.basicfields.lookup   = _.cloneextend(app.basicfields.normal, { edit: { ftype: 'select' }, edittag: { select: { lookup: true }, lookup: { usetable: true}} });
    this.basicfields.keyvalue = _.cloneextend(app.basicfields.normal, { edit: { ftype: 'select' }, edittag: { select: { lookup: true }, lookup: { usetable: false}} });
    this.basicfields.file   = _.cloneextend(app.basicfields.normal, { edittag: { }, general: { ftype: 'text'} });

    
    this.basicmodel=
    {
     modelname:"set in serving.js",
     collection:null, //handle to main mongodb collection
     links:[], //handle to main mongodb collection
     empty_object:{},
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
      this.preprocess_document(data , true);
      that.beforeadd( data , function (){ 
       that.doadd( data , function (data2){ 
        that.afteradd( data2 , function (){ 
         if(callback)callback(data2); } ); } ); } );
     },
     
     del: function( where, callback )
     {  
      var that=this;
      that.beforedel( where , function (){
       that.dodel( where , function (){
        that.afterdel( where , function (){
         if(callback)callback(); } ); } ); } );     
     },
     
     update: function( where ,data ,callback )
     {
      var that=this;
      this.preprocess_document(data , false);
      that.beforeupdate( where ,data , function (){ 
       that.doupdate( where ,data , function (where ,data2){ 
        that.afterupdate( where ,data2 , function (){ 
         if(callback)callback(where ,data2); } ); } ); } );
     },
     
     select: function( where , callback)
     {
      var that=this;
      that.beforeselect( where , function ()
      {
       that.doselect( where , function (cursor)
       {  
        that.afterselect( where , cursor, function (cursor2)
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
     save: function( data , callback)
     {
    	 this.preprocess_document(data , data._id!=null);
    	 this.collection.save(data , {} ,function(err , result){
    		 console.log(sys.inspect(err));
    		 console.log(sys.inspect(result));
    		 callback();
    	 });
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
     doadd: function( data2 ,callback )
     {
      this.collection.insert(data2,function (err,doc){ 
       if(err) throw err;
       //sys.puts('sucsess');
       //sys.puts(JSON.stringify(doc) );
       if(callback) callback(doc);
      });
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
     
     doupdate: function( where, data2 ,callback )
     {
      //sys.puts(sys.inspect([where,data2]));
      this.collection.update(where,data2,function (err,doc){ 
       if(err) throw err;
       //sys.puts('sucsess');
       //sys.puts(JSON.stringify(doc) );
       if(callback) callback(doc);
      });
 
     },
     
     doselect: function(where , callback )
     {
      //http://www.slideshare.net/kbanker/mongodb-schema-design-mongony
     
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
		 
		  if(!where)
      {
       this.collection.find(
       function(err, cursor)
       {
        if(err) throw err;
        else 
        {
         if(callback) callback(cursor);
        }
       });
      }
      else
      {
       this.collection.find(where,
       function(err, cursor)
       {
        if(err) throw err;
        else 
        {
         if(callback) callback(cursor);
        }
       });
      }
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
       //if(this.modelname=='t1_organization')  console.log(" addpages page "+p);      
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
      app.prepare_subitems_lists(this);
      var self = this;
      _.foreach(this.fields , function(field , field_key){
    	  self.empty_object[field_key] = '';
      });
      this.addpages();
      this.addurls();
      
     },
     dosetupfirst: function( data )
     {

     },
     dosetup: function( data )
     {

     },
     dosetuplast: function( data )
     {

      this.init();

     },
     // end real action functions //////////////
     // after event functions //////////////
     afteradd: function( data , callback )
     {
      if(callback)callback(data);
     },
     afterdel: function( where , callback  )
     {
      if(callback)callback(where);
     },
     afterupdate: function( where, data , callback  )
     {
      if(callback)callback(where,data);
     },
     afterselect: function(where , cursor, callback)
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
     beforeadd: function( data1 , callback )
     {
      data1 = this.preprocess_document(data1 , true);
      if(callback)callback(data1);
     },
     beforedel: function( where , callback )
     {
      if(callback)callback();
     },
     beforeupdate: function( where,data,callback )
     {
      if(callback)callback(where,data);
     },
     beforeselect: function(where,callback)
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
     preprocess_document: function(data , add)
     {
      var model = this;
      console.log(sys.inspect(data));
      for(var x in model.fields)
      {
       if( model.fields.hasOwnProperty( x))
       {
        var field = model.fields[x];
        //console.log(sys.inspect(field.edit));
        //console.log(sys.inspect(field.general.title));
        //console.log(sys.inspect(data.x));
        //every time especialy on update
        if(field.edit.ftype==='select' && 
           field.edittag.lookup.usetable && 
           field.edittag.lookup.linkedfield=='_id')
        {
         if (x in data && typeof data[x]==='string' && data[x]!='')
         {
          data[x]=app.ObjectID.createFromHexString(data[x]); 
         }
         else
         {
          delete data[x];   
         }
        }
        if(field.general.ftype==='date')
        {
         if (x in data && typeof data[x]==='string' && data[x]!='')
         {
          data[x]=app.phpjs.strtotime(data[x]); 
         }
         else
         {
          delete data[x];   
         } 
        }
        // on add
        if(add)
        {
         if ('default_value' in field.add)
         {
          data[x]=field.add.default_value;
         }
        }
       }
      }
      return data;
     },
     // end before event functions //////////////
     pages:
     {
      list:require('templates/default/list').page.call(this,app,this), 
      add:require('templates/default/add').page.call(this,app,this), 
      edit:require('templates/default/edit').page.call(this,app,this), 
      del:require('templates/default/del').page.call(this,app,this), 
     },
     
        
     
    };
    
  this.pages=
  {
   admin           :require('templates/default/default').page.call(this,this), 
   website_default :require('templates/website/default').page.call(this,this), 
   favicon         :require('cachedfile_page'  ).page.call(this,this,'favicon.ico','favicon.ico'), 
   jquery          :require('cachedfolder_page').page.call(this,this,'lib/jquery','deps/jquery',false,/(^development-bundle)|jquery-validate\\lib|demo/),
   ckeditor        :require('cachedfolder_page').page.call(this,this,'lib/ckeditor','deps/ckeditor',/\.(js|html|gif|png|jpg|ico|css)$/,/(^\.)|(^_)|(\.\/)|(\.svn)/),
  };
  
  this.setuppages=function (callback)
  {
   var p,tempalte_name,template_function;
   for(p in this.pages)
   {
    if(this.pages.hasOwnProperty(p) )
    {
     var page=this.pages[p];
     //add .model reference to page
     app.load_templates(page);
    }
   }
   // adlater calling route before, route after
   for(p in this.pages)
   {
    if(this.pages.hasOwnProperty(p) )
    {
     var pageurl='/'+this.pages[p].pageurl;
     var amatch={page:this.pages[p]}
     if(this.pages[p].urlmatch)
     {
      //sys.puts(this.pages[p].urlmatch+"="+pageurl);
      amatch[this.pages[p].urlmatch]=pageurl;
     }
     else
      amatch['path']=pageurl;
     //app.url_routes.push({path:pageurl,code:function(req,res,page,request_i){res.writeHead(200, { 'Content-Type': 'text/plain'});res.write('hello world');res.end();}});
     app.url_routes.push(amatch);
    }
   }
   
   //add some more other non page routes
   app.url_routes.push({path:'/exit',code:function(req,res,page,request_i){res.writeHead(200, { 'Content-Type': 'text/plain'});res.write('exit');res.end();process.nextTick(function () {process.exit();});}});
   
   if(callback)callback(callback);
  }
   
  this.watchpage = function (pagename,filename)
  {
   var watch_arr=[];
   for(k in app.pages[pagename].load_templates)
   {
    if(app.pages[pagename].load_templates.hasOwnProperty (k))
    {
     watch_arr.push('templates/'+app.pages[pagename].load_templates[k]);
    }
   }
   watch_arr.push(filename);

   autoreload.watchrel(watch_arr,filename, function (newmodule)
   {
    var oldpage=app.pages[pagename];
    var page=newmodule.page.apply(oldpage.pagethis?oldpage.pagethis:app,oldpage.pagearguments?oldpage.pagearguments:[app]);
    app.load_templates(page,function ()
    {
     app.pages[pagename]=page;
     for(var i=0;i<app.url_routes.length;i++)
     {
      if(app.url_routes[i].page)
      if(app.url_routes[i].page.pagefilename==oldpage.pagefilename)
      {
       app.url_routes[i].page=page;
       app.url_routes[i].page=page;
       console.log( (new Date).toTimeString() + ' page ' + i + ' reloaded ' + filename );
      }
     }
    }); 
    // route update here
   }); 
  }
  
}

var app = new App();
this.app = app;
   autoreload.watchrel("httputils.js", function (newmodule)
   {
    app.httputils=newmodule;
   });