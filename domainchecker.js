var express = require('express');
var app = express();
var ejs = require('ejs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('views'));


//taking the 'url-exists' module
var urlexits = require('url-exists');
var deasync = require('deasync');
var dns = require('dns');


//the array for checking domains
var domain=['.com','.org','.in','.club.in','.club','.es','.se'];


//reading the first html page
app.get('/home',function(req,res,next)
{
    res.sendfile('domainchecker.html');
});
    var name,a,b;
    var array=[];
//action when check button is selected.
app.post('/check', function(req, res)
{
    array=[];
    name = req.body.input;

    //running loop of domain array
    for(var i =0;i<domain.length;i++)
    {
        var value=domain[i];
        var url = name + value;

        function syncFunc()
        {
            var ret = null;
            dns.resolve4(url, function(err, result)
            {
                ret = {err : err, result : result+'-'+value}
            });

            while((ret == null))
            {
                deasync.runLoopOnce();
            }
            console.log(ret.err);
           if(ret.err) return("Not a url - "+value);
            else return("It is a url - "+value);
        }

        array.push(syncFunc());
    }
    console.log(array);

    res.render('email',{name : array});
});


//serving on the localhost
app.listen(8082);
