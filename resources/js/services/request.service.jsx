import Repository from './repository'

class RequestService {
  async getAllRequests(credentials) {
    const endpoint = '/returnings'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async getStateInRequestList() {
    const endpoint = `/returnings/states`
    const response = await Repository.get(endpoint)
    return response
  }
}

export default new RequestService()
