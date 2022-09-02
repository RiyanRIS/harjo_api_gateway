var express = require('express');
var axios = require('axios');
var app = express();

app.get('/dokter', function (req, res) {
    let harinya = req.query.hari
    var data = JSON.stringify({
      "hari": harinya
    });
  
    var config = {
      method: 'get',
      url: 'http://rspau.ddns.net:8080/backend-apm/api/jadwal-dokter',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    axios(config)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(500)
    });
})

app.get('/tarif', function (req, res) {
    let harinya = req.query.hari
    var data = JSON.stringify({
      "hari": harinya
    });
  
    var config = {
      method: 'get',
      url: 'http://36.91.47.11:8080/backend-apm/api/master/get-tarif-ruangan',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    axios(config)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(500)
    });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})