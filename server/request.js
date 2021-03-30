const axios = require("axios");

const isDev = process.env.NODE_ENV == "development";
const BASE = isDev ? `http://localhost:3200` : `https://api.napchart.com`;

let headers = {};

module.exports.request = function request(method, functionName, data) {
  return axios({
    url: BASE + functionName,
    method: method,
    data: data,
    withCredentials: true,
  }).then((res) => res.data);
};
