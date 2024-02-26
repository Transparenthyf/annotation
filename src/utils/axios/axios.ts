import axios from 'axios'

let api = ''

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  api = '/api'
}

axios.defaults.baseURL = api

export default axios
