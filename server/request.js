const axios = require('axios')

const BASE = `https://api.napchart.com`

let headers = {}


module.exports.request = function request(method, functionName, data) {
  return axios({
    url: BASE + functionName,
    method: method,
    data: data,
    withCredentials: true,
  }).then((res) => res.data)
  // return ky(BASE + functionName, {
  //   method: method,
  //   json: data,
  //   headers,
  //   credentials: "include",
  //   mode: "cors"
  // }).json()
}
