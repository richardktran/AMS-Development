import axios from './base.service'

const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    return ''
  }
}

class Repository {
  constructor() {
    this.token = ''
  }

  async get(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .get(`${endpoint}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        params: data,
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }

  async post(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .post(`${endpoint}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }

  async put(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .put(`${endpoint}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }

  async patch(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .patch(`${endpoint}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }

  async delete(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .delete(`${endpoint}`, {
        data: data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }

  async export(endpoint, data) {
    this.token = getToken()
    const response = await axios
      .get(`${endpoint}`, {
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: `Bearer ${this.token}`,
        },
        responseType: 'blob',
        params: data,
      })
      .then((res) => {
        return {
          code: res.status,
          message: res.statusText,
          data: res.data,
        }
      })
      .catch((err) => {
        return {
          code: err.response.status,
          message: err.response.data.message,
          data: undefined,
        }
      })
    return response
  }
}

export default new Repository()
