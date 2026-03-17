// src/types/certificate.ts

/**
 * 前端展示用的证书摘要信息（用于列表）
 */
export interface Certificate {
  id: number;
  name: string;           // 后端字段
  domain: string;         // 后端字段
  createdAt: string;      // 后端字段 (YYYY-MM)
  contactPerson: string;  // 后端字段
  reportSummary?: string; // 后端字段
  imageUrl: string;       // 后端字段
  detailUrl: string;
}

/**
 * 企业信息
 */
export interface CertifiedCompany {
  name: string;
  logo?: string;
}

/**
 * 证书详情（用于详情页）
 */
export interface CertificateDetail extends Certificate {
  keywords?: string[];        // 通常包含 [domain]
  summary?: string;           // 技术报告摘要（对应 reportSummary）
  contact?: string;           // 联系人（对应 contactPerson）
  certifiedCompanies?: CertifiedCompany[]; // 持证企业列表（由后端 /categories/:id 接口返回）
}