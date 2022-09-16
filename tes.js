var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://36.91.47.11:8080/backend-apm/api/master/get-tarif-ruangan',
  headers: { 
    'Content-Type': 'application/json'
  },
  // data : data,
  timeout: 2000
};

axios(config)
.then(function (response) {
    console.log(response.data)
})
.catch(function (error) {
    console.log(500)
});