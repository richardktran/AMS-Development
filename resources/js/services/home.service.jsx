import Repository from './repository'

class HomeService {
  async getAllHomeList(credentials) {
    const endpoint = '/my/assignments'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async acceptAssignment(id) {
    const endpoint = '/my/assignments/' + id + '?state_key=ACCEPTED'
    const response = await Repository.patch(endpoint, id)
    return response
  }

  async declineAssignment(id) {
    const endpoint = '/my/assignments/' + id + '?state_key=DECLINED'
    const response = await Repository.patch(endpoint, id)
    return response
  }

  async requestForReturning(id) {
    const endpoint = '/my/assignments/' + id + '/return'
    const response = await Repository.post(endpoint, id)
    return response
  }
}

export default new HomeService()
