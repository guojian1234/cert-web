// src/api/enterpriseCert.ts
import api from './base'

export const enterpriseCertApi = {
  // 创建企业证书
  create(formData: FormData): Promise<void> {
    return api.post('/enterprise-certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {})
  },

  // 👇 新增：根据 categoryId 获取企业证书列表
  getByCategoryId(categoryId: number): Promise<any[]> {
    return api.get(`/enterprise-certificates/by-category/${categoryId}`).then(res => res.data)
  }
}