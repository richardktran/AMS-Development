import Repository from './repository'

class AuthService {
  async login(credentials) {
    const endpoint = '/login'
    const response = await Repository.post(endpoint, credentials)
    return response
  }

  async logout() {
    const endpoint = '/logout'
    const response = await Repository.post(endpoint)
    return response
  }

  async changePassFirstTime(credentials) {
    const endpoint = '/change-password'
    const response = await Repository.patch(endpoint, credentials)
    return response
  }

  async changePass(credentials) {
    const endpoint = '/change-password'
    const response = await Repository.patch(endpoint, credentials)
    return response
  }

  async verifyUserByToken() {
    const endpoint = '/me'
    const response = await Repository.get(endpoint)
    return response
  }
}

export default new AuthService()
