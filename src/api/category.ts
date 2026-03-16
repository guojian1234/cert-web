// src/api/category.ts
import api from './base'
import type { Certificate, CertificateDetail } from '@/types/certificate'

function toCertificate(item: any): Certificate {
  return {
    id: item.id,
    name: item.name,
    domain: item.domain,              // 👈 补全
    createdAt: item.createdAt,      // 👈 补全
    contactPerson:item.contactPerson,
    reportSummary:item.reportSummary,
    imageUrl: item.imageUrl, // 👈 补全

  }
}

// ⚠️ 注意：不再处理 certifiedCompanies！
function toCertificateDetail(item: any): Omit<CertificateDetail, 'certifiedCompanies'> {
  return {
    id: item.id,
    name: item.name,
    domain: item.domain,              
    createdAt: item.createdAt,      
    contactPerson:item.contactPerson,
    keywords: [item.domain],
    imageUrl: item.imageUrl || '',
    summary: item.reportSummary || '',
    contact: item.contactPerson || ''
  }
}

export const categoryApi = {
  getAll(): Promise<Certificate[]> {
    return api.get('/categories').then(res => (res.data as any[]).map(toCertificate))
  },

  getById(id: number): Promise<Omit<CertificateDetail, 'certifiedCompanies'>> {
    return api.get(`/categories/${id}`).then(res => toCertificateDetail(res.data))
  },

  create(formData: FormData): Promise<void> {
    return api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {})
  }
}