import React from 'react'
import { FiRefreshCw } from 'react-icons/fi';

function RefreshIcon({ fetchDashboardData, isRefreshing }) {
  return (
    <button 
        onClick={fetchDashboardData}
        disabled={isRefreshing}
        className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#133F25] border-2 border-[#133F25] px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm transition-all font-extrabold text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Sinkronisasi Semua Data"
        >
        <FiRefreshCw className={`text-base md:text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
        {/* Tulisan "Refresh Data" sekarang SELALU MUNCUL baik di HP maupun Laptop */}
        <span>Refresh Data</span>
    </button>
  )
}

export default RefreshIcon