import Repository from './repository'

class AssignmentService {
  async getAllAssignments(credentials) {
    const endpoint = '/assignments'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async getAssignmentById(id) {
    const endpoint = `/assignments/${id}`
    const response = await Repository.get(endpoint)
    return response
  }

  async getStateInAssignmentList() {
    const endpoint = `/assignments/states`
    const response = await Repository.get(endpoint)
    return response
  }

  async disableAssignment(id) {
    const endpoint = '/assignments/' + id
    const response = await Repository.delete(endpoint, id)
    return response
  }

  async getUserSameLocation(data) {
    const endpoint = '/users'
    const response = await Repository.get(endpoint, data)
    return response
  }

  async getAssetSameLocation(data) {
    const endpoint = '/assets?states[]=AVAILABLE'
    const response = await Repository.get(endpoint, data)
    return response
  }

  async createAssignment(data) {
    const endpoint = '/assignments'
    const response = await Repository.post(endpoint, data)
    return response
  }

  async updateAssignment(id, data) {
    const endpoint = `/assignments/${id}`
    const response = await Repository.patch(endpoint, data)
    return response
  }

  async createRequestForReturnAssignment(id) {
    const endpoint = `/assignments/${id}/return`
    const response = await Repository.post(endpoint)
    return response
  }
}

export default new AssignmentService()
