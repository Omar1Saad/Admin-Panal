import React, { useState, useEffect } from 'react'
import { Key, Users, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { apiService } from '../services/api'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentLicenses, setRecentLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsResponse, licensesResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getLicenses()
      ])

      if (statsResponse.success) {
        setStats(statsResponse.stats)
      }

      if (licensesResponse.success) {
        // أخذ آخر 5 تراخيص
        setRecentLicenses(licensesResponse.licenses.slice(0, 5))
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات لوحة التحكم:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'revoked':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط'
      case 'expired':
        return 'منتهي الصلاحية'
      case 'revoked':
        return 'ملغي'
      default:
        return 'غير محدد'
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-gray-600">
          نظرة عامة على حالة نظام التراخيص
        </p>
      </div>

      {/* إحصائيات سريعة */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-8 w-8 text-primary-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي التراخيص</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_licenses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">التراخيص النشطة</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active_licenses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">التراخيص المنتهية</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.expired_licenses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المستخدمين النشطين</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active_users}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* آخر التراخيص */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">آخر التراخيص</h2>
          <button
            onClick={() => window.location.hash = '#licenses'}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            عرض الكل
          </button>
        </div>

        {recentLicenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">المفتاح</th>
                  <th className="table-header">المستخدم</th>
                  <th className="table-header">الحالة</th>
                  <th className="table-header">تاريخ الانتهاء</th>
                  <th className="table-header">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLicenses.map((license) => (
                  <tr key={license.id}>
                    <td className="table-cell">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {license.license_key.substring(0, 12)}...
                      </code>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{license.user_name}</p>
                        <p className="text-sm text-gray-500">{license.user_email}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(license.status)}
                        <span className="mr-2 text-sm text-gray-900">
                          {getStatusText(license.status)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {format(new Date(license.expires_at), 'dd/MM/yyyy', { locale: ar })}
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {format(new Date(license.created_at), 'dd/MM/yyyy', { locale: ar })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد تراخيص</h3>
            <p className="mt-1 text-sm text-gray-500">لم يتم إنشاء أي تراخيص بعد.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
