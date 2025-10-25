import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Eye } from 'lucide-react'
import { apiService } from '../services/api'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

function LicensesPage() {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    loadLicenses()
  }, [])

  const loadLicenses = async () => {
    try {
      const response = await apiService.getLicenses()
      if (response.success) {
        setLicenses(response.licenses)
      }
    } catch (error) {
      console.error('خطأ في تحميل التراخيص:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLicense = async (licenseData) => {
    try {
      const response = await apiService.createLicense(licenseData)
      if (response.success) {
        await loadLicenses()
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('خطأ في إنشاء الترخيص:', error)
    }
  }

  const handleRevokeLicense = async (licenseKey) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الترخيص؟')) {
      try {
        const response = await apiService.revokeLicense(licenseKey)
        if (response.success) {
          await loadLicenses()
        }
      } catch (error) {
        console.error('خطأ في إلغاء الترخيص:', error)
      }
    }
  }

  const handleUpdateLicense = async (licenseKey, updateData) => {
    try {
      const response = await apiService.updateLicense(licenseKey, updateData)
      if (response.success) {
        await loadLicenses()
        return true
      }
      return false
    } catch (error) {
      console.error('خطأ في تحديث الترخيص:', error)
      return false
    }
  }

  const handleDeleteLicense = async (licenseKey) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الترخيص نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const response = await apiService.deleteLicense(licenseKey)
        if (response.success) {
          await loadLicenses()
        }
      } catch (error) {
        console.error('خطأ في حذف الترخيص:', error)
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // يمكن إضافة إشعار نجاح هنا
  }

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.license_key.toLowerCase().includes(searchTerm.toLowerCase())
    
    let status = 'active'
    if (!license.is_active) {
      status = 'revoked'
    } else {
      const now = new Date()
      const expiryDate = new Date(license.expires_at)
      if (expiryDate <= now) {
        status = 'expired'
      }
    }
    
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (license) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    if (!license.is_active) {
      return `${baseClasses} bg-gray-100 text-gray-800`
    }
    
    const now = new Date()
    const expiryDate = new Date(license.expires_at)
    
    if (expiryDate <= now) {
      return `${baseClasses} bg-red-100 text-red-800`
    }
    
    return `${baseClasses} bg-green-100 text-green-800`
  }

  const getStatusText = (license) => {
    if (!license.is_active) {
      return 'ملغي'
    }
    
    const now = new Date()
    const expiryDate = new Date(license.expires_at)
    
    if (expiryDate <= now) {
      return 'منتهي الصلاحية'
    }
    
    return 'نشط'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة التراخيص</h1>
          <p className="mt-1 text-sm text-gray-600">
            إدارة وإنشاء وإلغاء تراخيص النظام
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 ml-2" />
          إنشاء ترخيص جديد
        </button>
      </div>

      {/* فلاتر البحث */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في التراخيص..."
                className="input-field pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="expired">منتهي الصلاحية</option>
              <option value="revoked">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول التراخيص */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">المفتاح</th>
                <th className="table-header">المستخدم</th>
                <th className="table-header">الحالة</th>
                <th className="table-header">تاريخ الانتهاء</th>
                <th className="table-header">تاريخ الإنشاء</th>
                <th className="table-header">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLicenses.map((license) => (
                <tr key={license.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {license.license_key.substring(0, 16)}...
                    </code>
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{license.user_name}</p>
                      <p className="text-sm text-gray-500">{license.user_email}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={getStatusBadge(license)}>
                      {getStatusText(license)}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {format(new Date(license.expires_at), 'dd/MM/yyyy', { locale: ar })}
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {format(new Date(license.created_at), 'dd/MM/yyyy', { locale: ar })}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedLicense(license)
                          setShowDetailsModal(true)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(license.license_key)}
                        className="text-gray-400 hover:text-gray-600"
                        title="نسخ المفتاح"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLicense(license)
                          setShowEditModal(true)
                        }}
                        className="text-blue-400 hover:text-blue-600"
                        title="تعديل الترخيص"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLicense(license.license_key)}
                        className="text-red-400 hover:text-red-600"
                        title="حذف الترخيص"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLicenses.length === 0 && (
          <div className="text-center py-8">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد نتائج</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على تراخيص تطابق معايير البحث.
            </p>
          </div>
        )}
      </div>

      {/* نافذة إنشاء ترخيص جديد */}
      {showCreateModal && (
        <CreateLicenseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateLicense}
        />
      )}

      {/* نافذة تفاصيل الترخيص */}
      {showDetailsModal && selectedLicense && (
        <LicenseDetailsModal
          license={selectedLicense}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedLicense(null)
          }}
        />
      )}

      {/* نافذة تعديل الترخيص */}
      {showEditModal && selectedLicense && (
        <EditLicenseModal
          license={selectedLicense}
          onClose={() => {
            setShowEditModal(false)
            setSelectedLicense(null)
          }}
          onUpdate={handleUpdateLicense}
        />
      )}
    </div>
  )
}

// مكون إنشاء ترخيص جديد
function CreateLicenseModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    duration_days: 365,
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onCreate(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">إنشاء ترخيص جديد</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المستخدم
              </label>
              <input
                type="text"
                name="user_name"
                required
                className="input-field"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="user_email"
                required
                className="input-field"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مدة الترخيص (بالأيام)
              </label>
              <input
                type="number"
                name="duration_days"
                required
                min="1"
                className="input-field"
                value={formData.duration_days}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات (اختياري)
              </label>
              <textarea
                name="notes"
                rows="3"
                className="input-field"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء الترخيص'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// مكون تفاصيل الترخيص
function LicenseDetailsModal({ license, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">تفاصيل الترخيص</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">المفتاح</label>
              <code className="block mt-1 text-xs bg-gray-100 p-2 rounded break-all">
                {license.license_key}
              </code>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
              <p className="mt-1 text-sm text-gray-900">{license.user_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <p className="mt-1 text-sm text-gray-900">{license.user_email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">الحالة</label>
              <p className="mt-1 text-sm text-gray-900">{license.status}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
              <p className="mt-1 text-sm text-gray-900">
                {format(new Date(license.expires_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الإنشاء</label>
              <p className="mt-1 text-sm text-gray-900">
                {format(new Date(license.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// مكون تعديل الترخيص
function EditLicenseModal({ license, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    user_email: license.user_email || '',
    user_name: license.user_name || '',
    notes: license.notes || '',
    is_active: license.is_active
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const success = await onUpdate(license.license_key, formData)
      if (success) {
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">تعديل الترخيص</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المستخدم
              </label>
              <input
                type="text"
                name="user_name"
                required
                className="input-field"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="user_email"
                required
                className="input-field"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات
              </label>
              <textarea
                name="notes"
                rows="3"
                className="input-field"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="mr-2 block text-sm text-gray-900">
                الترخيص نشط
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'جاري التحديث...' : 'تحديث الترخيص'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LicensesPage
