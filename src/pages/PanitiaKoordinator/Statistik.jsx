import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Store/useAuthStore';
import api from '../../config/api';
import IndikatorDivisi from '../../components/dashboard/IndikatorDivisi';
import LineChartDivisi from '../../components/charts/LineChartDivisi';
import ManagementChart from '../../components/charts/ManagementChart';
import RekapAbsenSeluruhDivisi from '../../components/dashboard/RekapAbsenSeluruhDivisi';

export default function Statistik() {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const [chartDataDivisi, setChartDataDivisi] = useState(null);
  const [chartDataManagement, setChartDataManagement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Akses Kontrol Khusus MNG, INTI, PRESIDIUM
  useEffect(() => {
    if (user && user.nama) {
      const namaDivisiRaw = user?.divisi?.nama_divisi || "";
      const isMng = namaDivisiRaw.toLowerCase() === "mng" ||
        namaDivisiRaw === "Medical and Guard (MNG)" ||
        namaDivisiRaw.toLowerCase().includes("medical");

      const isAuthorized = role === "INTI" || role === "PRESIDIUM" || isMng;

      if (!isAuthorized) {
        alert("Akses Ditolak: Anda tidak memikili otoritas untuk melihat Statistik.");
        navigate('/panitia/dashboard', { replace: true });
      }
    }
  }, [user, role, navigate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const isPanitiaMng = role === "PANITIA" && (
      user?.divisi?.nama_divisi?.toLowerCase() === "mng" ||
      user?.divisi?.nama_divisi === "Medical and Guard (MNG)" ||
      user?.divisi?.nama_divisi?.toLowerCase().includes("medical")
    );

    // Hindari menembak endpoint grafik-divisi jika role adalah PRESIDIUM
    const fetchGrafik = role !== "PRESIDIUM"
      ? api.get('/api/absensi/grafik-divisi')
      : Promise.resolve({ data: { data: { labels: [], datasets: [] } } });

    // Hindari menembak endpoint statistik jika role PANITIA di MNG
    const fetchStatistik = !isPanitiaMng
      ? api.get('/api/absensi/statistik')
      : Promise.resolve({ data: { data: { management: null } } });

    // Tarik 2 Endpoint sekaligus
    const [resGrafik, resStatistik] = await Promise.allSettled([
      fetchGrafik,
      fetchStatistik
    ]);

    // Handle Grafik Divisi
    if (resGrafik.status === 'fulfilled') {
      const response = resGrafik.value;
      const apiData = response.data.data;
      console.log(apiData)
      if (apiData && apiData.labels && apiData.datasets) {
        setChartDataDivisi({
          labels: apiData.labels,
          datasets: apiData.datasets
        });
      }
    } else {
      console.error("Gagal menarik grafik divisi:", resGrafik.reason);
    }

    // Handle Statistik Management Lintas Divisi (Dipindah dari Endpoint Lama)
    if (resStatistik.status === 'fulfilled') {
      const response = resStatistik.value;
      const respData = response.data.data || response.data;
      console.log(respData)
      if (respData.management) {
        setChartDataManagement(respData.management);
      }
    } else {
      console.error("Gagal menarik statistik management:", resStatistik.reason);
    }

    setIsLoading(false);
  }, [role, user]);

  useEffect(() => {
    document.title = "Statistik Kinerja | Bakti Unand 2026";
    if (user && user.nama) {
      fetchData();
    }
  }, [fetchData, user]);

  // Loading state ketika layout pertama diredirections ke page ini
  if (!user || !user.nama) {
    return (
      <div className="min-h-screen bg-[#F1F3F4] p-3 flex flex-col items-center justify-center">
        <span className="font-bold text-[#133F25] animate-pulse">Memuat Profil...</span>
      </div>
    );
  }

  // Jika setelah dicek ternyata bukan role yang berhak, jangan render halaman ini!
  const isMng = user?.divisi?.nama_divisi?.toLowerCase() === "mng" ||
    user?.divisi?.nama_divisi === "Medical and Guard (MNG)" ||
    user?.divisi?.nama_divisi?.toLowerCase().includes("medical");
  const isAuthorized = role === "INTI" || role === "PRESIDIUM" || isMng;

  if (!isAuthorized) return null;

  const isPanitiaMng = isMng && role === "PANITIA";
  const numVisibleCharts = [role !== 'PRESIDIUM', !isPanitiaMng].filter(Boolean).length;

  return (
    <div className="md:pt-12 min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 lg:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden">

      {/* HEADER PAGE SECTION */}
      <div className="relative flex justify-center items-center mb-6 mt-3 w-full h-12 md:h-16">
        <h1 className="text-3xl md:text-4xl font-[#014421] font-bold uppercase drop-shadow-sm text-center w-full z-10">
          STATISTIK KINERJA
        </h1>
        <div className="absolute right-2 md:right-6 top-0 md:top-2 z-20 w-fit transform scale-90 md:scale-100 flex-shrink-0">
          <IndikatorDivisi namaDivisi={user?.divisi?.nama_divisi || 'Memuat...'} warna="#67E8F9" />
        </div>
      </div>

      {/* GRAPH CONTAINER */}
      <div className={`grid grid-cols-1 ${numVisibleCharts === 2 ? 'xl:grid-cols-2' : ''} gap-4 md:gap-6 mt-6`}>

        {/* KARTU KIRI: LINE CHART SELURUH DIVISI (Disembunyikan untuk PRESIDIUM) */}
        {role !== "PRESIDIUM" && (
          <div className="w-full">
            <LineChartDivisi
              chartData={chartDataDivisi}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* KARTU KANAN: BAR CHART MANAGEMENT (Disembunyikan untuk PANITIA MNG) */}
        {!isPanitiaMng && (
          <div className="w-full">
            {chartDataManagement ? (
              <div className="bg-white rounded-md px-6 py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center w-full h-full min-h-[350px]">
                <ManagementChart
                  totalKegiatan={chartDataManagement.total_kegiatan}
                  totalAnggota={chartDataManagement.total_anggota}
                  hadir={chartDataManagement.hadir}
                  tidakHadir={chartDataManagement.tidak_hadir}
                  izin={chartDataManagement.izin}
                  sakit={chartDataManagement.sakit}
                  persentaseHadir={chartDataManagement.persentase_hadir}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <div className="bg-white rounded-md px-6 py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center justify-center w-full h-full min-h-[350px]">
                {!isLoading ? (
                  <span className="text-gray-400 font-medium">Data Management Chart Tidak Tersedia</span>
                ) : (
                  <span className="text-[#133F25] font-black animate-pulse">Menyiapkan Grafik...</span>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* REKAPITULASI TABEL SELURUH DIVISI (Khusus INTI & MNG) */}
      {(role === "INTI" || isMng) && (
         <RekapAbsenSeluruhDivisi />
      )}

    </div>
  );
}
