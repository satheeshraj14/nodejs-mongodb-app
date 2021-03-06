var _ = require('deps/nodejs-clone-extend/merger');  //  lets do: _.extend(same,otherobjexts),  _.clone(obj) - creates new reference, see source to understand // 
var sys = require('sys');

function setupfirst(app)
{
 //modify self and others 
 app.database.name='webappdb';
} this.setupfirst=setupfirst;

function add_models(app)
{

 app.models.mainpage                = _.clone(  app.basicmodel );
 app.models.mainpage.general.name   = 'mainpage';
 app.models.mainpage.general.urlprefix = 'mainpage';
 app.models.mainpage.general.title  = 'Main Page';
 app.models.mainpage.fields.title   = _.extend( _.clone(app.basicfields.normal),{general:{title:'Title'}} );
 app.models.mainpage.fields.text    = _.extend( _.clone(app.basicfields.html),{general:{title:'Text on Main Page'}} );
 app.models.mainpage.fields.footer  = _.extend( _.clone(app.basicfields.html),{general:{title:'Footer of the website'},list:{use:false}} );
 app.models.mainpage.fields.select = _.cloneextend(app.basicfields.lookup, { general: { title: 'some list' }, edittag: { lookup: { tablename: 'mainpage', linkedfield: '_id', displayfield: 'title' }}});
 app.models.mainpage.links.push ( {name:"othercollection",url:"othercollection.html",func:function (data){ return this.url+'?id='+data.id }} );

  
} this.add_models=add_models;

function setup(app) // exported constructor
{
  add_models(app);
} this.setup=setup;

function setuplast(app)
{
  //add_pages_and_urls(app);
 //verify self and others
} this.setuplast=setuplast;
