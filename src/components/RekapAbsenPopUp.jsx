import React, { useState, useEffect } from 'react';
import { FiCamera, FiX } from 'react-icons/fi'; // Gunakan ikon kamera dan silang dari Feather Icons

// 1. KOMPONEN UTAMA
function RekapAbsenPopUp({ isOpen, onClose, kegiatanValue, absensiData = [] }) {
  // 2. STATE UNTUK DATA DINAMIS (Untuk Demo Dinamis)
  const [displayedData, setDisplayedData] = useState([]);

  // 3. STATE UNTUK POP-UP SUKSES (Setelah Scan Berhasil)
  const [showSuccess, setShowSuccess] = useState(false);

  const handleScanBerhasil = (dataQR) => {
    // 1. Kirim data ke backend via Axios
    // axios.post('/api/absen', { qr: dataQR }).then(() => {
    
    // 2. Munculkan Pop-up Sukses
    setShowSuccess(true); 
    
    // })
  };

  useEffect(() => {
    // Setel data dari props atau dummy saat modal dibuka
    if (isOpen) {
      setDisplayedData(absensiData.length > 0 ? absensiData : [
        { id: 1, no: 1, nama: "Muhammad Abdul Abdulan", fakultas: "Fakultas Teknologi Informasi", status: 'Hadir' },
        { id: 2, no: 2, nama: "Indah Siti Sitian", fakultas: "Fakultas Teknik", status: 'Tidak Hadir' },
      ]);
    }
  }, [isOpen, absensiData]);

  // JIKA MODAL TIDAK TERBUKA, JANGAN RENDER APA-APA
  if (!isOpen) return null;

  // 3. FUNGSI LOGIKA FRONTEND
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case 'Hadir': return 'bg-[#039914] text-white'; // Hijau terang
      case 'Tidak Hadir': return 'bg-[#990303] text-white'; // Merah-jingga
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const toggleStatus = (id) => {
    setDisplayedData(displayedData.map(item => {
      if (item.id === id) {
        // Logika sederhana: Balik status antara Hadir dan Tidak Hadir
        const newStatus = item.status === 'Hadir' ? 'Tidak Hadir' : 'Hadir';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  return (
    // Latar belakang buram (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-[#133F25]">
      
      {/* 4. KOTAK PUTIH MODAL */}
      <div className="bg-white w-full max-w-5xl rounded-md relative shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- BAGIAN HEADER (Sticky Top) --- */}
        {/* PERBAIKAN: Padding dikecilkan di mobile (px-4 md:px-8) */}
        <div className="px-4 md:px-8 pt-4 pb-4 flex justify-between items-center flex-shrink-0 border-b-2 border-gray-100">
          <h2 className="text-xl lg:text-2xl font-black text-[#004D25] tracking-wide m-0">
            Absensi Anggota
          </h2>
          <button 
            onClick={onClose}
            className="text-[#133F25] hover:text-red-500 transition-colors"
          >
            <FiX className="text-4xl" />
          </button>
        </div>

        {/* --- BAGIAN TENGAH / KONTEN (Scrollable Area) --- */}
        {/* PERBAIKAN: Padding dikecilkan di mobile (p-4 md:p-8) */}
        <div className="p-4 md:p-8 overflow-y-auto flex-grow">
          
          {/* 5. BAGIAN FOTO */}
          <div className="flex justify-center mb-4">
            <div className="w-[80%] md:w-[20%] lg:w-[20%] lg:h-45 bg-[#D9D9D9]/40 border-2 border-[#014421] rounded-xl p-8 flex flex-col items-center justify-center">
              <button onClick={() => handleScanBerhasil("")} className="flex items-center justify-center gap-2.5 bg-[#133F25] text-white font-black text-xs lg:text-base uppercase px-1 py-3 rounded-lg shadow-md hover:bg-green-900 transition-colors w-full">
                <FiCamera className="text-xs" />
                <span className='text-xs'>Ambil Foto</span>
              </button>
            </div>
          </div>

          {/* 6. INPUT KEGIATAN */}
          <div className="w-full mb-4">
            <label className="block text-md font-bold text-[#133F25] mb-2 tracking-wide">
              Nama Kegiatan
            </label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue={kegiatanValue || "Rapat Divisi RnB 1"} 
                className="w-full bg-white border-2 border-[#133F25] rounded-xl px-4 py-4 text-md font-bold text-black/80 focus:outline-none"
                readOnly
              />
            </div>
          </div>

          {/* 7. GARIS PEMISAH & JUDUL STATUS KEHADIRAN */}
          <div className="w-full mb-4">
            <label className="block text-md font-bold text-[#133F25] mb-2 tracking-wide">
              Status Kehadiran
            </label>
            <div className="w-full h-0.5 bg-[#133F25]"></div>
          </div>

          {/* 8. TABEL KEHADIRAN */}
          {/* KUNCI RESPONSIVE: overflow-x-auto agar bisa discroll nyamping di HP */}
          <div className="w-full overflow-x-auto pb-2">
            
            {/* min-w-[600px] memaksa tabel tetap lebar dan tidak tergencet */}
            <div className="min-w-[600px] flex flex-col mb-2">
              
              {/* Header Tabel (Garis tetap border-[#014421]) */}
              <div className="flex items-center pb-4 font-black text-[#133F25] text-md tracking-wider border-b-2 border-[#014421] mb-2">
                <div className="w-[10%] text-center">No.</div>
                <div className="w-[35%]">Nama</div>
                <div className="w-[35%]">Fakultas</div>
                <div className="w-[20%] text-center">Status</div>
              </div>

              {/* Baris Data */}
              <ul className="flex flex-col">
                {displayedData.map((item) => (
                  <li 
                    key={item.id} 
                    // Garis tetap border-[#014421]
                    className="flex py-2 items-center font-semibold text-black/80 text-md border-b-2 border-[#014421] last:border-b-2 last:border-b-[#014421] hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-[10%] text-center font-bold text-md">{item.no}</div>
                    
                    <div className="w-[35%] text-md font-medium pr-2 truncate" title={item.nama}>
                      {item.nama}
                    </div>
                    
                    <div className="w-[35%] text-md font-medium pr-2 truncate" title={item.fakultas}>
                      {item.fakultas}
                    </div>
                    
                    <div className="w-[20%] flex justify-center">
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        className={`px-4 py-2 w-full max-w-[120px] rounded-md font-black text-sm lg:text-xs uppercase shadow-md transition-all active:scale-95 ${getStatusButtonStyle(item.status)}`}
                      >
                        {item.status}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>

        {/* --- BAGIAN FOOTER (Sticky Bottom) --- */}
        {/* PERBAIKAN: Padding dikecilkan di mobile (px-4 md:px-8) */}
        <div className="px-4 md:px-8 py-5 border-t border-gray-200 bg-white flex justify-end flex-shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-2.5 bg-[#014421] text-white font-black text-xl uppercase px-12 py-3 rounded-xl shadow-md hover:bg-green-900 transition-colors active:scale-95"
          >
            DONE
          </button>
        </div>

      </div>
    </div>
  );
}

export default RekapAbsenPopUp;