// src/stores/auth.ts
import { defineStore } from 'pinia';

// ===== 类型定义 =====
export interface CertificateCategory {
  id: number;
  name: string; // 类别名称
  domain: string; // 所属研究领域
  createdAt: string; // 时间 (YYYY-MM)
  imageUrl: string; // 图片 URL（模拟上传后的地址）
  reportSummary?: string; // 👈 新增：报告摘要（选填）
}

export interface EnterpriseCertificate {
  id: number;
  enterpriseName: string; // 企业名称
  categoryId: number; // 关联的类别 ID
  certificateImageUrl: string; // 企业证书图片
  issuedAt: string; // 颁发时间 (YYYY-MM)
}

// ===== 初始数据 =====
const initialDomains = [
  '大数据与智能化',
  '云计算',
  '数据中心',
  '数字健康',
  '金融科技',
  '审计与治理',
  '开源与软件安全',
  '生物科技',
  '政企数字化转型',
  '人工智能',
];

const initialCategories: CertificateCategory[] = [
  {
    id: 1,
    name: '云原生能力成熟度',
    domain: '云计算',
    createdAt: '2024-01',
    imageUrl: 'https://dummyimage.com/60x60/1ABC9C/ffffff&text=CNCF',
    reportSummary: '评估企业在容器化、微服务架构、持续交付等方面的成熟度水平，涵盖平台工程与可观测性能力。'
  },
  {
    id: 2,
    name: 'DevOps 能力成熟度',
    domain: '审计与治理',
    createdAt: '2023-11',
    imageUrl: 'https://dummyimage.com/60x60/4A90E2/ffffff&text=DevOps',
    reportSummary: '从文化、自动化、精益、度量和共享（CALMS）五个维度评估组织 DevOps 实施水平。'
  },
  // 可添加更多，也可以不提供 reportSummary
];

const initialEnterpriseCerts: EnterpriseCertificate[] = [
  {
    id: 101,
    enterpriseName: '阿里云',
    categoryId: 1,
    certificateImageUrl: 'https://dummyimage.com/150x100/E74C3C/ffffff&text=Alibaba+Cert',
    issuedAt: '2024-05'
  },
];

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    domains: [...initialDomains],
    categories: [...initialCategories], // 👈 包含 reportSummary
    enterpriseCertificates: [...initialEnterpriseCerts],
  }),
  actions: {
    login(username: string, password: string) {
      if (username === 'admin' && password === '123456') {
        this.isAuthenticated = true;
        return true;
      }
      return false;
    },
    logout() {
      this.isAuthenticated = false;
    },
    addDomain(domain: string) {
      if (!this.domains.includes(domain)) {
        this.domains.push(domain);
      }
    },
    // 添加证书类别（自动处理 id 和 reportSummary）
    addCategory(category: Omit<CertificateCategory, 'id'>) {
      const newId = Math.max(...this.categories.map(c => c.id), 0) + 1;
      this.categories.push({
        ...category,
        id: newId
      });
    },
    // 添加企业证书
    addEnterpriseCertificate(cert: Omit<EnterpriseCertificate, 'id'>) {
      const newId = Math.max(...this.enterpriseCertificates.map(c => c.id), 0) + 1;
      this.enterpriseCertificates.push({
        ...cert,
        id: newId
      });
    },
  },
});