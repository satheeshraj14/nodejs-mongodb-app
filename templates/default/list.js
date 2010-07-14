this.page=function(app,model)
{
 var page=
     {
      pageurl:'/list.jsp',
       // add error on existing function       
       load_templates:  // strings treated as template filenames to load and prepeare
       {
        list:"default/list.html",
       }, 
       // will be here: this.list=function(){...
       
       prepeare_templates:  // function treated as templates to prepeare
       {
        //template2:function (vars){var echo=""; echo+=... return echo;}, 
       },
       // will be here: this.template2=function(){...

       // to load more templates from templates , use:
       //    this.load('listgrid','paritials/listgrid.html');
       //    this.listgrid({'data1':data});
       
       prepere_data:function (page,template_name,callback)
       {
       var loaded_subitems={};
        //app.load_subitems( page.model , 'list' , function ()
        //{
         callback({'page':page,'app':app, model_name:'model1', 'model1':page.model });
        //});
       },
       
       main:function (req,res,page,callback)
       {
         var loaded_subitems={};
        //app.load_subitems( page.model , 'list' , function (loaded_subitems){
         //var currentpage=request.querystring['page']
         page.model.list(null,function (cursor)
         {
          cursor.toArray(function(err, items)
          {
           res.writeHead(200, { 'Content-Type': 'text/html'});        
           data1={'page':page,'app':app,cursor_name:'cursor1','cursor1': items, model_name:'model1', 'model1':page.model, sub_cursors_name:'sub_cursors1', sub_cursors1: loaded_subitems };
           res.write( page.list.call(page,data1) );
           res.end();
           // sys.puts();
           //sys.puts(sys.inspect(   items ));
          });
         });
        //});
         
       return true;
       },
      };
      
      
 
 return page; 
} ;
 
