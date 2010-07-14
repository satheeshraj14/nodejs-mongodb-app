var sys=require('sys');

this.page=function(app,model)
{
 var page=
     {
      pageurl:'/add.jsp',
       // add error on existing function       
       load_templates:  // strings treated as template filenames to load and prepeare
       {
        add:"default/add.html",
        content:"default/content.html",
       }, 
       // will be here: this.add=function(){...
       
       prepeare_templates:  // function treated as templates to prepeare
       {
        //template2:function (vars){var echo=""; echo+=... return echo;}, 
       },
       // will be here: this.template2=function(){...

       // to load more templates from templates , use:
       //    this.load('addgrid','paritials/addgrid.html');
       //    this.addgrid({'data1':data});
       
       prepere_data:function (page,template_name,callback)
       {
        //shoud i add static support ? app.load_subitems( page.model , 'static'?<<should i add this later? , function (loaded_subitems) {
        var loaded_subitems={};
        //app.load_subitems( page.model , 'add' , function (loaded_subitems) {  
         callback( {'page':page,'app':app, 'req':{}, model_name:'model1', 'model1':page.model, sub_cursors_name:'sub_cursors1', sub_cursors1: loaded_subitems } );
        //});
       },
       
       main:function (req,res,page,callback)
       {
        //var currentpage=request.querystring['page']
        if(req.method==='POST')
         app.httputils.post(req,res,function (data)
         {
          page.model.add(data['model1'],function (datawithkey)
          {
           app.httputils.redirect(req,res,'/'+page.model.general.urlprefix+page.model.pages.list.pageurl);
           //res.writeHead(200, { 'Content-Type': 'text/html'});        
           //data1={'page':page,'app':app, model_name:'model1', 'model1':page.model, 'content': '/'+page.model.general.urlprefix+page.pageurl };
           //res.write(      page.content.call(page,data1)        );
           //res.end();
          });
         });
        else
        {
         res.writeHead(200, { 'Content-Type': 'text/html'});
         var loaded_subitems={};
         app.load_subitems( page.model , 'add' , function (loaded_subitems)  {
          //sys.puts(sys.inspect(page));
          data1={'page':page,'app':app, 'req':req, model_name:'model1', 'model1':page.model, sub_cursors_name:'sub_cursors1', sub_cursors1: loaded_subitems };
          page.add.call(page,data1,function (echo){
           res.write(echo);
           res.end();
          } );
         });
        }
        return true;
       },
      };
      
      
 
 return page; 
} ;
 
