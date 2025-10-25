import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://license-y64y.onrender.com/api'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // إضافة الرمز المميز للطلبات
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // تسجيل دخول المدير
  async login(username, password) {
    try {
      const response = await this.client.post('/admin/login', {
        username,
        password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في تسجيل الدخول')
    }
  }

  // الحصول على قائمة التراخيص
  async getLicenses() {
    try {
      const response = await this.client.get('/admin/licenses')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في جلب التراخيص')
    }
  }

  // إنشاء ترخيص جديد
  async createLicense(licenseData) {
    try {
      const response = await this.client.post('/admin/licenses', licenseData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في إنشاء الترخيص')
    }
  }

  // إلغاء ترخيص
  async revokeLicense(licenseKey) {
    try {
      const response = await this.client.post('/admin/licenses/revoke', {
        license_key: licenseKey,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في إلغاء الترخيص')
    }
  }

  // الحصول على الإحصائيات
  async getStats() {
    try {
      const response = await this.client.get('/admin/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في جلب الإحصائيات')
    }
  }

  // الحصول على سجل التراخيص
  async getLogs() {
    try {
      const response = await this.client.get('/admin/logs')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في جلب السجل')
    }
  }

  // تحديث ترخيص
  async updateLicense(licenseKey, updateData) {
    try {
      const response = await this.client.put(`/admin/licenses/${licenseKey}`, updateData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في تحديث الترخيص')
    }
  }

  // حذف ترخيص
  async deleteLicense(licenseKey) {
    try {
      const response = await this.client.delete(`/admin/licenses/${licenseKey}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل في حذف الترخيص')
    }
  }
}

export const apiService = new ApiService()
