var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var dtime = { "unix":null, "natural":null};
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
     res.sendFile(__dirname + '/views/index.html');    

});

app.get("/:date", function (req, res) {
  var re1 = /\d{10}/;
  var re2 = /[a-zA-Z]{3,}/;
  var re3 = /\W\d{2}\W/;
  var re4 = /\d{4}/;
  var date = req.params.date;
  if (re1.test(date)){
    request('http://www.convert-unix-time.com/api?timestamp=' + date,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var tt = JSON.parse(body);            
            dtime.unix = date;
            dtime.natural = tt.localDate;
            res.send(dtime);            
                }
          });
  }else if(re2.test(date) && re3.test(date) && re4.test(date)){
    var monthIndex = {"jan":"01", "feb":"02", "may":"03", "apr":"04", "mar":"05", "jun":"06", "jul":"07", "aug":"08", "sep":"09", "oct":"10", "nov":"11", "dec":"12"};
    var year = re4.exec(date);
    var data = re3.exec(date);
    var data1 = /\d{2}/.exec(data);    
    var monthdata = JSON.stringify(re2.exec(date)[0]);    
    var month = monthIndex[monthdata.toLowerCase().substring(1,4)];    
    request('http://www.convert-unix-time.com/api?date=' + year + "-" + month + "-" + data1,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var tt = JSON.parse(body);
            
            dtime.unix = tt.timestamp;
            dtime.natural = tt.utcDate;
            res.send(dtime);            
                }
          });
    
    
    
  }else{
  res.send(dtime);              
  }
  
  
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app  is listening on port ' + listener.address().port);
});
