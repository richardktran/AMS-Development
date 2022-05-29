import Repository from './repository'

class ReportService {
  async getAllReportList(credentials) {
    const endpoint = '/reports'
    const response = await Repository.get(endpoint, credentials)
    return response
  }

  async downloadReport(credentials) {
    const endpoint = '/reports/export'
    const response = await Repository.export(endpoint, credentials)
    return response
  }
}

export default new ReportService()
