import api from './base'

export const domainApi = {
  // 获取所有领域
  getAll(): Promise<string[]> {
    return api.get('/domains').then(res => res.data)
  },

  // 添加新领域
  add(name: string): Promise<void> {
    return api.post('/domains', { name }).then(() => {})
  }
}