import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import useAuthStore from '../../Store/useAuthStore';
import api from '../../config/api';

export default function AddTodoPopUp({ isOpen, onClose, onSuccess }) {
  const [type, setType] = useState('Rapat'); 
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [time, setTime] = useState('');

  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const divisiId = useAuthStore((state) => state.user?.divisi_id);
  const role = useAuthStore((state) => state.role);
  const [isLoading, setIsLoading] = useState(false);
  const [scope, setScope] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (role === 'INTI') setScope('GLOBAL');
      else if (role === 'PRESIDIUM') setScope('LEADERS');
      else setScope('');
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  // FIX: Extract fungsi reset form agar tidak duplikat
  const resetForm = () => {
    setName('');
    setDate('');
    setDeadline('');
    setTime('');
    setPlace('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    const formattedTime = time ? `${time.replace(':', '.')} WIB` : '';

    const newKegiatan = { 
      nama_acara: name, 
      tanggal: date, 
      waktu: formattedTime, 

      lokasi: place, 
      deskripsi: description,
      divisi_id: divisiId, 
    };

    if (type === 'Rapat' && (role === 'INTI' || role === 'PRESIDIUM')) {
      newKegiatan.scope = scope;
    }

    const newTodo = {
      tugas: name,
      deskripsi: description,
      start_date: date,
      deadline: deadline,
      divisi_id: divisiId,
    };

    try {
      if (type === 'Rapat') {
        await api.post('/api/kegiatan', newKegiatan);
      } else if (type === 'Tugas') {
        await api.post('/api/todos', newTodo);
      }
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error adding new item:", error);
      alert("Gagal menambahkan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 font-sans text-[#133F25]">
      <div className="bg-white w-full max-w-5xl rounded-md relative shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-all">
        {/* --- BAGIAN HEADER --- */}
        <div className="px-10 pt-4 pb-4 flex justify-start items-center flex-shrink-0 border-b-2 border-gray-100">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center gap-2.5 bg-[#133F25] text-white font-extrabold text-sm uppercase px-6 py-3 rounded-xl shadow-md hover:bg-green-900 transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <FiArrowLeft className="text-sm flex-shrink-0" />
            <span className='m-0'>Back</span>
          </button>
        </div>

        {/* --- BAGIAN TENGAH / KONTEN --- */}
        <form className="py-5 px-10 overflow-y-auto flex-grow space-y-8">
          
          {/* INPUT JENIS KEGIATAN */}
          <div className="w-full">
            <label className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Jenis Kegiatan
            </label>
            <div className="flex gap-4 items-center">
              <button 
                type="button"
                onClick={() => setType('Rapat')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all duration-200 cursor-pointer hover:scale-105 border-2 ${
                  type === 'Rapat' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Rapat
              </button>
              <button 
                type="button"
                onClick={() => setType('Tugas')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all duration-200 cursor-pointer hover:scale-105 border-2 ${
                  type === 'Tugas' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Tugas
              </button>
            </div>
          </div>

          {/* INPUT NAMA KEGIATAN */}
          <div className="w-full">
            <label htmlFor="name" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Nama Kegiatan
            </label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25]/30 rounded-xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
              required
            />
          </div>

          {/* INPUT SCOPE (Hanya Rapat & INTI/PRESIDIUM) */}
          {type === 'Rapat' && (role === 'INTI') && (
            <div className="w-full">
              <label htmlFor="scope" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                Siapa yang ikut kegiatannya?
              </label>
              <select 
                id="scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-white border-2 border-[#133F25]/30 rounded-xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
              >
                {role === 'INTI' && (
                  <>
                    <option value="GLOBAL">Global</option>
                    <option value="LEADERS">Inti dan Koordinator</option>
                    <option value="INTERNAL_INTI">Hanya Inti</option>
                  </>
                )}
                
              </select>
            </div>
          )}

          {/* GRID INPUT TANGGAL, PUKUL & TEMPAT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            
            <div className='flex flex-col gap-8'>
              <div>
                <label htmlFor="date" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                  Tanggal Dilaksanakan
                </label>
                <input 
                  id="date"
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                  required
                />
              </div>


            </div>

            {type === 'Tugas' && (
              <div>
                <label htmlFor="deadline" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                  Deadline
                </label>
                <input 
                  id="deadline"
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                  required
                />
              </div>
            )}

            {type === 'Rapat' && (
              <>
                <div>
                  <label htmlFor="time" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                    Pukul
                  </label>
                  <input 
                    id="time"
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="place" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                    Tempat
                  </label>
                  <input 
                    id="place"
                    type="text" 
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                    required
                  />
                </div>
              </>
            )}

          </div>

          {/* INPUT DESKRIPSI */}
          <div className="w-full pb-6">
            <label htmlFor="description" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Deskripsi (Boleh Dikosongkan)
            </label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full bg-white border-2 border-[#133F25]/30 rounded-xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0 resize-none"
            />
          </div>

        </form>

        {/* --- BAGIAN FOOTER --- */}
        <div className="px-10 py-6 border-t border-gray-100 bg-white flex justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={
              isLoading || 
              !name || 
              !date || 
              (type === 'Rapat' && (!time || !place)) ||
              (type === 'Tugas' && !deadline)
            } 
            className="flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-extrabold text-2xl uppercase px-16 py-4 rounded-xl shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin text-2xl" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Tambah</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}