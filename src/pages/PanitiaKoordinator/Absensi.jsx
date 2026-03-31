import React, { useEffect, useCallback } from 'react';
import RekapAbsen from '../../components/absensi/RekapAbsen';
import IndikatorDivisi from '../../components/dashboard/IndikatorDivisi';
import useAuthStore from '../../Store/useAuthStore';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload } from 'react-icons/fi';
import api from '../../config/api';
import PieChartAbsen from '../../components/charts/PieChartAbsen';
import ManagementChart from '../../components/charts/ManagementChart';
import baktiLogo from '../../assets/Icons/BaktiLogo.webp';

export default function Absensi() {

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fetchUserData = useAuthStore((state) => state.fetchUserData);

  const [chartData, setChartData] = React.useState({ personal: null, management: null });
  const [isFetchingAbsen, setIsFetchingAbsen] = React.useState(true);

  // Pastikan user data sudah di-fetch
  useEffect(() => {
    if (!user || !user.nama) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const fetchAbsensiData = useCallback(async () => {
    setIsFetchingAbsen(true);
    try {
        const response = await api.get('/api/absensi/statistik');
        const respData = response.data.data || response.data;
        setChartData({
          personal: respData.personal || respData,
          management: respData.management || null
        });
    } catch (error) {
        console.error("❌ Gagal menarik API Statistik Absensi:", error);
    }
    setIsFetchingAbsen(false);
  }, [token]);

  useEffect(() => {
    document.title = "Absensi | Bakti Unand 2026";
    fetchAbsensiData();
  }, [fetchAbsensiData]);

  const handleDownloadQR = () => {
    const svg = document.querySelector("#qr-container svg");
    if (!svg) return;

    // Konversi SVG ke Canvas lalu ke PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Supaya resolusi tinggi
      const padding = 20;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2);

      // Beri background putih (karena svg transparan)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Letakkan ke tengah
      ctx.drawImage(img, padding, padding);

      // Unduh PNG
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Absensi_${user?.nama?.replace(/\s+/g, '_') || 'Panitia'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Guard: Jangan render konten sampai data user sudah lengkap
  const isUserLoaded = user && user.nama;

  if (!isUserLoaded) {
    return (
      <div className="md:pt-12 min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 lg:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#133F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-bold text-lg text-[#133F25]">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:pt-12 min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 lg:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden">

      {/* --- HEADER --- */}
      <div className="relative flex justify-center items-center mb-6 mt-3 w-full h-12 md:h-16">
        <h1 className="text-3xl md:text-4xl font-[#014421] font-bold uppercase drop-shadow-sm text-center w-full z-10">
          ABSENSI
        </h1>
        <div className="absolute right-2 md:right-6 top-0 md:top-2 z-20 w-fit transform scale-90 md:scale-100 flex-shrink-0">
          <IndikatorDivisi namaDivisi={user?.divisi?.nama_divisi || 'Memuat...'} warna="#67E8F9" />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6`}>

        {/* KARTU 1: QR ABSENSI */}
        <div className="bg-white rounded-md px-6 py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8 self-start">
            Qr Absensi Kamu
          </h2>
          <div className="relative p-2 border-4 border-black rounded-2xl mt-8 mb-8" id="qr-container">
            {user?.qr_token ? (
              <div className="relative w-full h-full flex justify-center items-center">
                <QRCodeSVG
                  value={user.qr_token.toString()}
                  size={256}
                  level="H"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  imageSettings={{
                    src: baktiLogo,
                    height: 64,
                    width: 64,
                    excavate: true,
                  }}
                />
                {/* Overlay DOM Element Tepat Di Atas Excavate Hole untuk Style Border */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-[3px] border-[#133F25] rounded-xl flex items-center justify-center p-1.5 shadow-md"
                  style={{ width: "26%", height: "26%" }}
                >
                  <img src={baktiLogo} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl">
                <span className="animate-pulse font-bold text-gray-400">Memuat QR...</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadQR}
            disabled={!user?.qr_token}
            className="flex items-center gap-2 bg-[#133F25] text-white font-extrabold uppercase px-6 py-3 rounded-lg shadow-md hover:bg-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6 active:scale-95 cursor-pointer hover:scale-105 disabled:hover:scale-100"
          >
            <FiDownload className="text-xl" />
            <span>Download QR</span>
          </button>

          <div className="w-full h-0.5 bg-[#133F25] mb-6"></div>
          <h3 className="text-xl md:text-2xl font-black text-center">
            {user?.nama}
          </h3>
          <div className="mt-4">
            <IndikatorDivisi namaDivisi={user?.divisi?.nama_divisi || 'Memuat...'} warna="#67E8F9" />
          </div>
        </div>

        {/* KARTU 2: RIWAYAT ABSENSI */}
        <div className="bg-white rounded-md px-6 py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <PieChartAbsen
            totalKegiatan={chartData?.personal?.total_kegiatan}
            hadir={chartData?.personal?.hadir}
            tidakHadir={chartData?.personal?.tidak_hadir}
            izin={chartData?.personal?.izin}
            sakit={chartData?.personal?.sakit}
            isLoading={isFetchingAbsen}
          />
        </div>

        {/* KARTU 3: TATA CARA ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 md:col-span-2 lg:col-span-full mt-2">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Tata Cara Absensi
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base font-semibold text-black/80">
            <li>Setiap panitia memiliki <strong>QR Code unik</strong> yang tertera pada halaman ini.</li>
            <li>Untuk mengisi daftar hadir pada setiap kegiatan/rapat, cukup tunjukkan QR Code ini kepada Pengurus Inti atau Koordinator terkait.</li>
            <li>Pengurus Inti atau Koordinator akan memindai QR Code Anda menggunakan fitur <strong>Scanner Web</strong> yang terintegrasi di portal ini.</li>
            <li>Apabila Anda tidak dapat hadir, harap melapor. Status kehadiran seperti <strong>'Sakit'</strong> atau <strong>'Izin'</strong> hanya dapat diperbarui secara manual oleh Koordinator/Pengurus Inti.</li>
            <li>Statistik kehadiran Anda secara keseluruhan dapat dipantau langsung pada grafik <strong>'Riwayat Personal'</strong>.</li>
          </ol>
        </div>

        {/* KARTU 4: Edit Absensi */}
        {
          (role === 'INTI' || role === 'PRESIDIUM') && (
            <div className='bg-white rounded-md md:col-span-2 lg:col-span-full mt-2 shadow-sm border-2 border-gray-200'>
              <RekapAbsen />
            </div>
          )
        }

      </div>
    </div>
  );
}