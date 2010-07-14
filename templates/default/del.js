var sys=require('sys');

this.page=function(app,model)
{
 var page=
     {
      pageurl:'/del.jsp',
       // add error on existing function       
       load_templates:  // strings treated as template filenames to load and prepeare
       {
        del:"default/del.html",
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
        callback({'page':page,'app':app, model_name:'model1', 'model1':page.model,cursor_name:'cursor1' });;
       },
       
       main:function (req,res,page,callback)
       {
        //var currentpage=request.querystring['page']
        if(req.method==='POST')
        {
         app.httputils.post(req,res,function (data)
         {
          var updateok=false;
          if(data)
          {
           if(data['model1'])
           {
            if(data['model1']._id)
            {

             var where={'_id':app.ObjectID.createFromHexString(data['model1']['_id'])};
             delete data['model1']['_id'];
             // sys.puts( sys.inspect(where)); 
             page.model.del(where,function (where ,datawithkey)
             {
              //sys.puts( sys.inspect(where)); 
              updateok=true; 
              app.httputils.redirect(req,res,'/'+page.model.general.urlprefix+page.model.pages.list.pageurl);
             });
             
             if(!updateok)
             {
              res.writeHead(200, { 'Content-Type': 'text/html'});        
              data1={'page':page,'app':app, model_name:'model1', 'model1':page.model, 'content': sys.inspect(where) };
              res.write(      page.content.call(page,data1)        );
              res.end();
             }
             return;
            }
           }
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html'});
          data1={'page':page,'app':app,'content':'לא התקבל ID' + sys.inspect(data) };
          res.write( page.content.call(page,data1) );
          res.end();

         });
        }
        else
        {
         if(req.parsedurl.query['_id'])
         {
          page.model.list({'_id':app.ObjectID.createFromHexString(req.parsedurl.query['_id'])},function (cursor)
          {
           cursor.toArray(function(err, items)
           {
            res.writeHead(200, { 'Content-Type': 'text/html'});        
            data1={'page':page,'app':app,cursor_name:'cursor1','cursor1': items, model_name:'model1', 'model1':page.model };
            res.write( page.del.call(page,data1) );
            res.end();
            // sys.puts();
            //sys.puts(sys.inspect(   items ));
           });
          });
         }
         else
         {
           res.writeHead(200, { 'Content-Type': 'text/html'});
           data1={'page':page,'app':app,'content':'לא התקבל ID' + sys.inspect(req.parsedurl) + sys.inspect(app.ObjectID.createFromHexString(req.parsedurl.query['_id'])) };
           res.write( page.content.call(page,data1) );
           res.end();
         }
         //res.writeHead(200, { 'Content-Type': 'text/html'});        
         //data1={'page':page,'app':app, model_name:'model1', 'model1':page.model };
         //res.write(      page.add.call(page,data1)        );
         //res.end();
        }
        return true;
       },
      };
      
      
 
 return page; 
} ;
 
