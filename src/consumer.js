const axios = require('axios')
const express = require("express")
const server = express()
const getApiEndpoint = "http://localhost:8081"

const getUsers = async () => {
  const res = await axios
    .get(`${getApiEndpoint}/users`)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err.res
    })
  return res
}

const getUser = async (id) => {
      const res = await axios
        .get(`${getApiEndpoint}/users/${id}`)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.res
        })
    return res
}

const postUser = async (body) => {
      const res = await axios
      .post(`${getApiEndpoint}/users`, body, {'Content-Type': 'application/json;charset=utf-8'})
      .then((res) => {
          return res
        })
        .catch((err) => {
          return err.res
        })
    return res
}


module.exports = {
  server,
  getUsers,
  postUser,
  getUser,
};