import Repository from './repository'

class UserService {
  async disableUser(user_id) {
    const endpoint = '/users/' + user_id
    const response = await Repository.delete(endpoint, user_id)
    return response
  }

  async isAnyValidAssignment(user_id) {
    const endpoint = '/users/' + user_id + '/check-valid-assignment'
    const response = await Repository.post(endpoint, user_id)
    return response
  }

  async create(credentials) {
    const endpoint = '/users'
    const response = await Repository.post(endpoint, credentials)
    return response
  }

  async getAllUsers(credentials) {
    const endpoint = '/users'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async edit(id, credentials) {
    const endpoint = `/users/${id}`
    const response = await Repository.patch(endpoint, credentials)
    return response
  }

  async getUserById(id) {
    const endpoint = `/users/${id}`
    const response = await Repository.get(endpoint)
    return response
  }
}

export default new UserService()
