import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import { apiService } from '../services/api'
import { format, subDays, subMonths } from 'date-fns'
import { ar } from 'date-fns/locale'

function StatsPage() {
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    loadStatsData()
  }, [timeRange])

  const loadStatsData = async () => {
    try {
      const [statsResponse, logsResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getLogs()
      ])

      if (statsResponse.success) {
        setStats(statsResponse.stats)
      }

      if (logsResponse.success) {
        setLogs(logsResponse.logs)
      }
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredLogs = () => {
    const now = new Date()
    let startDate

    switch (timeRange) {
      case '7days':
        startDate = subDays(now, 7)
        break
      case '30days':
        startDate = subDays(now, 30)
        break
      case '90days':
        startDate = subDays(now, 90)
        break
      default:
        startDate = subDays(now, 7)
    }

    return logs.filter(log => {
      if (!log.timestamp) return false
      const logDate = new Date(log.timestamp)
      return !isNaN(logDate.getTime()) && logDate >= startDate
    })
  }

  const getActivityStats = () => {
    const filteredLogs = getFilteredLogs()
    const activityStats = {
      validations: 0,
      creations: 0,
      revocations: 0,
      errors: 0
    }

    filteredLogs.forEach(log => {
      switch (log.action) {
        case 'validate':
          activityStats.validations++
          break
        case 'create':
          activityStats.creations++
          break
        case 'revoke':
          activityStats.revocations++
          break
        case 'error':
          activityStats.errors++
          break
      }
    })

    return activityStats
  }

  const getDailyActivity = () => {
    const filteredLogs = getFilteredLogs()
    const dailyActivity = {}

    filteredLogs.forEach(log => {
      if (!log.timestamp) return
      const logDate = new Date(log.timestamp)
      if (isNaN(logDate.getTime())) return
      
      const date = format(logDate, 'yyyy-MM-dd')
      if (!dailyActivity[date]) {
        dailyActivity[date] = 0
      }
      dailyActivity[date]++
    })

    return Object.entries(dailyActivity)
      .map(([date, count]) => ({
        date,
        count,
        formattedDate: format(new Date(date), 'dd/MM', { locale: ar })
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const activityStats = getActivityStats()
  const dailyActivity = getDailyActivity()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإحصائيات والتقارير</h1>
          <p className="mt-1 text-sm text-gray-600">
            تحليل شامل لنشاط نظام التراخيص
          </p>
        </div>
        <select
          className="input-field w-48"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7days">آخر 7 أيام</option>
          <option value="30days">آخر 30 يوم</option>
          <option value="90days">آخر 90 يوم</option>
        </select>
      </div>

      {/* إحصائيات عامة */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
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
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">معدل النشاط</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((stats.active_licenses / stats.total_licenses) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* إحصائيات النشاط */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات النشاط</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <span className="text-sm text-gray-600">التحققات الناجحة</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{activityStats.validations}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 ml-2" />
                <span className="text-sm text-gray-600">التراخيص الجديدة</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{activityStats.creations}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 ml-2" />
                <span className="text-sm text-gray-600">التراخيص الملغية</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{activityStats.revocations}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-yellow-500 ml-2" />
                <span className="text-sm text-gray-600">الأخطاء</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{activityStats.errors}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط اليومي</h3>
          {dailyActivity.length > 0 ? (
            <div className="space-y-2">
              {dailyActivity.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.formattedDate}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 ml-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((day.count / Math.max(...dailyActivity.map(d => d.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-left">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد بيانات</h3>
              <p className="mt-1 text-sm text-gray-500">
                لا توجد أنشطة في الفترة المحددة.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* سجل الأنشطة الأخيرة */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">سجل الأنشطة الأخيرة</h3>
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">النشاط</th>
                  <th className="table-header">المفتاح</th>
                  <th className="table-header">النتيجة</th>
                  <th className="table-header">التاريخ</th>
                  <th className="table-header">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.slice(0, 10).map((log, index) => (
                  <tr key={index}>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="table-cell">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.license_key?.substring(0, 12)}...
                      </code>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.success ? 'نجح' : 'فشل'}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {log.timestamp ? format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ar }) : '-'}
                    </td>
                    <td className="table-cell text-sm text-gray-500">
                      {log.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد أنشطة</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم تسجيل أي أنشطة بعد.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsPage
