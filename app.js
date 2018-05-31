var express = require('express');
var app = express();
var request = require('request');

app.use(express.static(__dirname + '/public'));

//function for the request

function callme(page,id,leng){
       //page = page+1;
       var array = [];
        request("https://api.themoviedb.org/3/discover/movie?api_key=32839ce95eb4dd1fd4b14e2c7f56fb8d&page="+page,function(error,response,body){
          if(!error && response.statusCode == 200){
            if(typeof(body) === 'string'){
              var data = JSON.parse(body);
              for(i=0;i<data.results.length;i++)
              {
                if(data.results[i].title[0] === id)
                {
                  array.push(data.results[i]);
                  leng = leng +array.length;
                }
              }
                if(leng < 10)
                {
                  callme(page+1, id,leng);
                }
            }
            return array;
          }
        });

}




app.get("/",function(req,res){
var ids = [28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,10770,53,10752,37];
var id = ids[Math.floor(Math.random() * Math.floor(ids.length))];
  console.log("This is coming from the home page");
  console.log(id);
request("https://api.themoviedb.org/3/discover/movie?api_key=32839ce95eb4dd1fd4b14e2c7f56fb8d&with_genres="+id,function(error,response,body){
        if(!error && response.statusCode == 200){
        if (typeof(body) === 'string'){
          var data = JSON.parse(body); 
        }
        else{
            console.log(body);
        }
       res.render("home.ejs",{data: data});
    }
  });
});

app.get("/results",function(req,res){
	var movie = req.query.MovieName;
  console.log("This is coming from results");
	request("https://api.themoviedb.org/3/search/movie?api_key=32839ce95eb4dd1fd4b14e2c7f56fb8d&query="+movie,function(error,response,body){
		if(!error && response.statusCode == 200){
        if (typeof(body) === 'string'){
          var data = JSON.parse(body); 
          data["results"].forEach(function(e){
            if(e.title[0] === 'A')
            {
              console.log(e.title);
            }

          });
        }
        else
        {
            console.log(body);
        }
       res.render("results.ejs",{data: data});
    }

	});
});


app.get("/home",function(req,res){
  var id = req.query.genre;
  console.log("This is coming from genre");
  console.log(id);
  request("https://api.themoviedb.org/3/discover/movie?api_key=32839ce95eb4dd1fd4b14e2c7f56fb8d&with_genres="+id,function(error,response,body){
        if(!error && response.statusCode == 200){
        if (typeof(body) === 'string'){
          var data = JSON.parse(body); 
        }
        else
        {
            console.log(body);
        }
       res.render("home2.ejs",{data: data});
    }

  });

});


app.get("/alphabet",function(req,res){
  var id = req.query.alphabet;
  console.log("This is coming from alphabet");
  console.log(id);
  var page = 1;
  var MovieArray = [];
  request("https://api.themoviedb.org/3/discover/movie?api_key=32839ce95eb4dd1fd4b14e2c7f56fb8d&page="+page,function(error,response,body){
      if(!error && response.statusCode == 200){
        if (typeof(body) === 'string'){
          //alphabet filter limit it for 10
          var data = JSON.parse(body); 
          console.log(typeof(data));
          for(i=0;i<data.results.length;i++)
          {
            if (data.results[i].title[0] === id)
            {
              MovieArray.push(data.results[i])
            }
        }
        console.log(MovieArray);
        console.log(MovieArray[0].overview);
        console.log("The length of Movie Array is");
        console.log(MovieArray.length);
        var leng = MovieArray.length;
       if (MovieArray.length < 10)
       {
        var a = [];
        a = callme(page+1,id,leng);
        MovieArray.push.apply(MovieArray,a);
        console.log("This is the place for further addition");
        console.log("The length of the movie array inside the array");
        //console.log(a.length);
       }

      }
        else
        {
            console.log(body);
        }
       //res.render("alphabets.ejs",{data: data, id:id});
       res.render("alphabets.ejs",{data:MovieArray});

    }
  });

});

app.listen(3000,'127.0.0.1');
console.log("Connected to the server");


