import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';
import api from '../../config/api';

export default function RekapAbsenSeluruhDivisi() {
  const [data, setData] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile toggle filter

  // Filter States Aktif
  const [filters, setFilters] = useState({
    min_alpha: '',
    max_hadir: '',
    min_sakit: '',
    min_izin: '',
    divisi_id: '',
    role_filter: '',
    sort_by: 'alpha',
    sort_order: 'desc'
  });

  // State sementara input form (hanya diterapkan saat submit)
  const [formValues, setFormValues] = useState({ ...filters });

  const fetchDivisiOptions = useCallback(async () => {
    try {
       const res = await api.get('/api/divisi');
       setDivisiOptions(res.data.data || []);
    } catch (e) {
       console.error("Gagal ambil daftar divisi", e);
    }
  }, []);

  const fetchDataRekap = useCallback(async (activeFilters) => {
    setIsLoading(true);
    try {
      const params = {};
      Object.keys(activeFilters).forEach(k => {
          const apiKey = k === 'role_filter' ? 'role' : k;
          if (activeFilters[k] !== '') {
             params[apiKey] = activeFilters[k];
          }
      });
      
      const res = await api.get('/api/absensi/rekap-personal', { params });
      setData(res.data.data || []);
    } catch (error) {
      console.error("Gagal menarik rekap personal:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDivisiOptions();
    fetchDataRekap(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya run sekali saat mount, subsequent run trigger via apply filter

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setFilters(formValues);
    fetchDataRekap(formValues);
  };

  const handleResetFilter = () => {
    const resetState = {
      min_alpha: '', max_hadir: '', min_sakit: '', min_izin: '',
      divisi_id: '', role_filter: '', sort_by: 'alpha', sort_order: 'desc'
    };
    setFormValues(resetState);
    setFilters(resetState);
    fetchDataRekap(resetState);
  };

  const handleSort = (columnKey) => {
    const isAsc = filters.sort_by === columnKey && filters.sort_order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    const updated = { ...filters, sort_by: columnKey, sort_order: newOrder };
    
    // Sinkron state
    setFormValues(updated);
    setFilters(updated);
    fetchDataRekap(updated);
  };

  const SortIcon = ({ columnKey }) => {
    if (filters.sort_by !== columnKey) return <FiChevronDown className="opacity-30 inline ml-1" />;
    return filters.sort_order === 'asc' ? <FiChevronUp className="inline ml-1 text-green-700" /> : <FiChevronDown className="inline ml-1 text-green-700" />;
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border-2 border-gray-200 mt-6 mt-10 p-4 md:p-6 mb-10 overflow-hidden">
      
      {/* HEADER Komponen */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 border-gray-100">
         <div>
           <h2 className="text-2xl font-black text-[#133F25] flex items-center gap-2">
             Rekapitulasi Kritis Personel
           </h2>
           <p className="text-gray-500 text-sm font-medium mt-1">
             Gunakan filter batas persentase minimal di bawah untuk mencari "panitia bermasalah" spesifik.
           </p>
         </div>
         
         <button 
           onClick={() => setIsFilterOpen(!isFilterOpen)}
           className="md:hidden mt-4 flex items-center gap-2 bg-[#133F25] text-white px-3 py-2 rounded-lg text-sm font-bold"
         >
           <FiFilter /> Filter Pencarian
         </button>
      </div>

      {/* FILTER BOX */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6`}>
        <form onSubmit={handleApplyFilter}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Divisi & Role */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Divisi Spesifik</label>
              <select 
                value={formValues.divisi_id} 
                onChange={e => setFormValues({...formValues, divisi_id: e.target.value})}
                className="p-2 bg-white border border-gray-300 rounded-md text-sm font-medium outline-none focus:border-[#133F25]"
              >
                <option value="">-- Semua Divisi --</option>
                {divisiOptions.map(div => (
                  <option key={div.id} value={div.id}>{div.nama_divisi || div.nama}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Role Kepanitiaan</label>
              <select 
                value={formValues.role_filter} 
                onChange={e => setFormValues({...formValues, role_filter: e.target.value})}
                className="p-2 bg-white border border-gray-300 rounded-md text-sm font-medium outline-none focus:border-[#133F25]"
              >
                <option value="">-- Semua Role --</option>
                <option value="PANITIA">Panitia Biasa</option>
                <option value="PRESIDIUM">Presidium Inti</option>
              </select>
            </div>

            {/* Input Min Alpha & Max Hadir */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-red-600 uppercase">Min Alpha (Batas %)</label>
              <input 
                type="number" step="0.1" min="0" max="100" placeholder="Misal: 25(%)"
                value={formValues.min_alpha}
                onChange={e => setFormValues({...formValues, min_alpha: e.target.value})}
                className="p-2 bg-white border border-red-200 rounded-md text-sm font-bold text-red-700 outline-none focus:border-red-500 placeholder:font-normal"
              />
            </div>

             <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Max Hadir (Batas %)</label>
              <input 
                type="number" step="0.1" min="0" max="100" placeholder="Cari Kehadiran Rendah %"
                value={formValues.max_hadir}
                onChange={e => setFormValues({...formValues, max_hadir: e.target.value})}
                className="p-2 bg-white border border-gray-300 rounded-md text-sm font-medium outline-none focus:border-[#133F25]"
              />
            </div>

            {/* Input Sakit & Izin */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-amber-600 uppercase">Min Sakit (Batas %)</label>
              <input 
                type="number" step="0.1" min="0" max="100" placeholder="Misal: 30(%)"
                value={formValues.min_sakit}
                onChange={e => setFormValues({...formValues, min_sakit: e.target.value})}
                className="p-2 bg-white border border-amber-200 rounded-md text-sm font-bold text-amber-700 outline-none focus:border-amber-500 placeholder:font-normal"
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-blue-600 uppercase">Min Izin (Batas %)</label>
              <input 
                type="number" step="0.1" min="0" max="100" placeholder="Misal: 20(%)"
                value={formValues.min_izin}
                onChange={e => setFormValues({...formValues, min_izin: e.target.value})}
                className="p-2 bg-white border border-blue-200 rounded-md text-sm font-bold text-blue-700 outline-none focus:border-blue-500 placeholder:font-normal"
              />
            </div>

             {/* Tombol Kontrol */}
             <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex items-end gap-3 mt-2 lg:mt-0">
                <button type="submit" className="flex-1 bg-[#133F25] hover:bg-green-900 transition-colors text-white font-bold py-2 px-4 rounded-md flex justify-center items-center gap-2">
                   <FiFilter /> Terapkan Pencarian
                </button>
                <button type="button" onClick={handleResetFilter} className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2" title="Reset Aturan">
                   <FiX /> Bersihkan
                </button>
             </div>
          </div>
        </form>
      </div>

      {/* TABLE DATA */}
      <div className="w-full overflow-x-auto bg-white rounded-lg border border-gray-200">
         <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
               <tr className="bg-[#133F25] text-white">
                 <th className="py-3 px-4 font-bold text-sm border-b border-r border-[#133F25]/80 cursor-pointer" onClick={() => handleSort('nama')}>
                    Nama Personal <SortIcon columnKey="nama" />
                 </th>
                 <th className="py-3 px-3 font-bold text-sm border-b border-r border-[#133F25]/80">
                    Divisi & Role
                 </th>
                 <th className="py-3 px-3 font-bold text-sm border-b border-r border-[#133F25]/80 text-center cursor-pointer bg-[#388E3C] hover:bg-[#2E7D32]" onClick={() => handleSort('hadir')}>
                    Hadir <SortIcon columnKey="hadir" />
                 </th>
                 <th className="py-3 px-3 font-bold text-sm border-b border-r border-[#133F25]/80 text-center cursor-pointer bg-red-600 hover:bg-red-700" onClick={() => handleSort('alpha')}>
                    Alpha <SortIcon columnKey="alpha" />
                 </th>
                 <th className="py-3 px-3 font-bold text-sm border-b border-r border-[#133F25]/80 text-center cursor-pointer bg-blue-600 hover:bg-blue-700" onClick={() => handleSort('izin')}>
                    Izin <SortIcon columnKey="izin" />
                 </th>
                 <th className="py-3 px-3 font-bold text-sm border-b border-[#133F25]/80 text-center cursor-pointer bg-amber-500 hover:bg-amber-600" onClick={() => handleSort('sakit')}>
                    Sakit <SortIcon columnKey="sakit" />
                 </th>
               </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="text-center py-10">
                     <div className="flex justify-center items-center gap-2 text-[#133F25] font-bold animate-pulse">
                        <FiRefreshCw className="animate-spin" /> Mengambil Data Raster...
                     </div>
                   </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                   <td colSpan="6" className="text-center py-8 font-bold text-gray-500">
                     Tidak ada panitia yang sesuai dengan kriteria filter tersebut.
                   </td>
                </tr>
              ) : (
                data.map((item, idx) => {
                  // Warna baris merah terang jika alpha >= 25% *WARNING CONDITION HIGHLIGHT*
                  const isCritical = parseFloat(item.persen_alpha) >= 25;
                  
                  return (
                    <tr key={item.id || idx} className={`border-b border-gray-200 transition-colors ${isCritical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                       <td className="py-3 px-4">
                         <div className="font-bold text-gray-800">{item.nama}</div>
                         <div className="text-xs text-gray-500 font-medium">NIM: {item.nim}</div>
                       </td>
                       <td className="py-3 px-3">
                         <div className="font-bold text-gray-700 text-sm whitespace-nowrap">{item.divisi}</div>
                         <div className="inline-block px-2 py-0.5 mt-1 bg-gray-200 rounded-sm text-[10px] font-black tracking-widest text-[#133F25]">{item.role}</div>
                       </td>
                       
                       {/* HADIR */}
                       <td className="py-3 px-3 text-center border-l bg-green-50/30">
                         <div className="font-black text-lg text-[#388E3C]">{item.hadir}</div>
                         <div className="text-xs font-bold text-gray-500">{item.persen_hadir}%</div>
                       </td>

                       {/* ALPHA */}
                       <td className={`py-3 px-3 text-center border-l ${isCritical ? 'bg-red-100' : 'bg-red-50/20'}`}>
                         <div className="font-black text-lg text-red-600">{item.alpha}</div>
                         <div className={`text-xs font-bold ${isCritical ? 'text-red-700' : 'text-gray-500'}`}>{item.persen_alpha}%</div>
                       </td>

                        {/* IZIN */}
                       <td className="py-3 px-3 text-center border-l bg-blue-50/20">
                         <div className="font-black text-lg text-blue-600">{item.izin}</div>
                         <div className="text-xs font-bold text-gray-500">{item.persen_izin}%</div>
                       </td>

                        {/* SAKIT */}
                       <td className="py-3 px-3 text-center border-l bg-amber-50/20">
                         <div className="font-black text-lg text-amber-600">{item.sakit}</div>
                         <div className="text-xs font-bold text-gray-500">{item.persen_sakit}%</div>
                       </td>
                    </tr>
                  );
                })
              )}
            </tbody>
         </table>
      </div>
      
      {!isLoading && data.length > 0 && (
        <div className="mt-4 text-xs font-bold text-gray-400 text-right">
           Menampilkan {data.length} data personil.
        </div>
      )}

    </div>
  );
}
