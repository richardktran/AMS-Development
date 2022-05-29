import Repository from './repository'

class CategoryService {
  async createCategory(data) {
    const endpoint = '/categories'
    const response = await Repository.post(endpoint, data)
    return response
  }

  async getAllCategories() {
    const endpoint = '/categories'
    const response = await Repository.get(endpoint, [])
    return response
  }
}

export default new CategoryService()
