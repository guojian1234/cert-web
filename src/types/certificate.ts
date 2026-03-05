// src/types/certificate.ts

export interface Certificate {
  id: number;
  title: string;
  category: string;
  domain: string;
  publishDate: string;
  detailUrl: string;
  imageUrl: string;
}

export interface CertifiedCompany {
  name: string;
  logo?: string;
}

export interface CertificateDetail extends Certificate {
  keywords?: string[];
  summary?: string;
  contact?: string;
  certifiedCompanies?: CertifiedCompany[];

}

