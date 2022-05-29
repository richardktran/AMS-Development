import Repository from './repository'

class AssetService {
  async getAllAssets(credentials) {
    const endpoint = '/assets'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async createAsset(data) {
    const endpoint = '/assets'
    const response = await Repository.post(endpoint, data)
    return response
  }

  async getAssetById(id) {
    const endpoint = `/assets/${id}`
    const response = await Repository.get(endpoint)
    return response
  }

  async deleteAsset(asset_id) {
    const endpoint = '/assets/' + asset_id
    const response = await Repository.delete(endpoint, asset_id)
    return response
  }

  async isAssetAssigned(asset_id) {
    const endpoint = '/assets/' + asset_id + '?confirm'
    const response = await Repository.delete(endpoint, asset_id)
    return response
  }

  async getStateAndCategoryInAssetList() {
    const endpoint = `/assets?meta`
    const response = await Repository.get(endpoint)
    return response
  }

  async editAsset(id, assetData) {
    const endpoint = `/assets/${id}`
    const response = await Repository.patch(endpoint, assetData)
    return response
  }
}

export default new AssetService()
