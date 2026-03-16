// src/api/domain.ts
import api from './base'

export interface Domain {
  id: number
  name: string
}

export const domainApi = {
  getAll(): Promise<Domain[]> {
    return api.get('/domains').then(res => res.data)
  },
  add(name: string): Promise<void> {
    return api.post('/domains', { name }).then(() => {})
  }
}