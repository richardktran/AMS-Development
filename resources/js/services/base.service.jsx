import axios from 'axios'
const API_URL = process.env.MIX_API_URL

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
})
