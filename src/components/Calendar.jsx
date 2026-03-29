import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// 🔥 Tambahkan import icon jam, map, dan alert
import { FiX, FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';

// 1. Terima viewMode dari props
export default function Calendar({ viewMode, events }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);

  const formattedEvents = events.map((event) => {
    // Memotong "2026-03-28T02:35..." menjadi "2026-03-28" saja
    const justDate = event.date || event.start_date ? (event.date || event.start_date).split('T')[0] : '';

    // Mengubah 'color_hint' dari backend menjadi kode warna aslimu
    let bgColor = '#133F25'; // Warna default hijau gelap
    if (event.color_hint === 'red' || event.jenis === 'Global') bgColor = '#EF4444';
    else if (event.color_hint === 'blue' || event.jenis === 'MIT') bgColor = '#1E3A8A'; // Ubah warna blue jadi biru tua sesuai desain
    else if (event.color_hint === 'yellow' || event.jenis === 'Cofas') bgColor = '#FBBF24';
    else if (event.color_hint === 'green' || event.jenis === 'RND') bgColor = '#4ADE80';

    // Gabungkan data asli dengan data yang sudah dimodifikasi
    return {
      ...event,             // Bawa semua properti asli (id, title, lokasi, dll)
      date: justDate,       // Timpa format tanggalnya
      backgroundColor: bgColor // Tambahkan properti untuk warna kotak FullCalendar
    };
  });

  const displayedEvents = formattedEvents.filter((event) => {
    if (viewMode === 'global') return event.jenis === 'Global';
    return event.jenis !== 'Global'; 
  });

  // FUNGSI SAAT TANGGAL DIKLIK
  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr; 
    
    // Cari event yang jatuh pada tanggal yang diklik (baik start_date maupun date)
    const eventsOnThisDay = displayedEvents.filter((event) => {
      const eventDate = event.date || (event.start_date && event.start_date.split('T')[0]);
      return eventDate === clickedDate;
    });

    const dateObj = new Date(clickedDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    
    setSelectedDateStr(`${day} ${month} ${year}`);
    setSelectedEvents(eventsOnThisDay);
    setIsModalOpen(true); 
  };

  const renderKotakWarna = (eventInfo) => {
    return (
      <div 
        className="w-5 h-5 rounded-sm shadow-sm"
        style={{ backgroundColor: eventInfo.event.backgroundColor }}
        title={eventInfo.event.title}
      />
    );
  };

  return (
    <div className="w-full p-2 font-sans flex flex-col relative rounded-xl">
      
      {/* AREA KALENDER */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={displayedEvents}
        dateClick={handleDateClick}
        headerToolbar={{
          left: '',
          center: 'prev title next', 
          right: '' // Pastikan kanan kosong agar switch kita tidak tertabrak
        }}
        dayHeaders={false} 
        eventContent={renderKotakWarna}
        contentHeight="auto"
        height="auto"
        fixedWeekCount={false}
      />

      {/* AREA KETERANGAN (LEGEND) BAWAH */}
      <div className="mt-8 border-t-2 border-[#133F25] pt-4">
        <p className="text-sm font-extrabold text-[#133F25] mb-2">Ket :</p>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-black uppercase">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#EF4444]"></div> = Global</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#1E3A8A]"></div> = MIT</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#FBBF24]"></div> = Cofas</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#4ADE80]"></div> = RND</div>
        </div>
      </div>

       {/* KOMPONEN POP-UP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-15">
          {/* Kotak Putih Pop-up */}
          <div className="bg-white w-full max-w-5xl p-8 relative shadow-2xl rounded-lg transform transition-all max-h-[90vh] overflow-y-auto">
            
            {/* Tombol Silang (Close) */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#133F25] hover:text-red-500 transition-colors"
            >
              <FiX className="text-4xl font-bold" />
            </button>

            {/* Judul Tanggal (Dengan garis bawah hijau) */}
            <h2 className="text-3xl font-black text-[#133F25] border-b-[3px] border-[#81C784] w-fit pb-1 mb-8">
              {selectedDateStr}
            </h2>

            {/* Daftar Event */}
            <div className="space-y-4">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => {
                  
                  // LOGIKA PERHITUNGAN HARI (Untuk Todo)
                  let alertText = null;
                  if (event.deadline) {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const endDate = new Date(event.deadline);
                    endDate.setHours(0,0,0,0);
                    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) alertText = "Sisa 1 Hari Lagi";
                    else if (diffDays === 0) alertText = "Hari Ini Terakhir";
                    else if (diffDays < 0) alertText = "Tenggat Terlewati";
                  }

                  return (
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
                      
                      {/* KOTAK KARTU EVENT */}
                      <div
                        className="flex-grow px-6 py-4 text-white rounded-xl shadow-md transition-transform hover:-translate-y-0.5 flex flex-col gap-2"
                        style={{
                          backgroundColor: event.backgroundColor,
                          // Membuat gradien kehitaman di sebelah kanan sesuai desainmu
                          backgroundImage: `linear-gradient(to right, ${event.backgroundColor}, #00000080)`
                        }}
                      >
                        <h3 className="font-bold text-xl tracking-wide">{event.title || event.tugas || event.nama_acara}</h3>
                        
                        {/* BARIS DETAIL (Ikon, Waktu, Lokasi, Tanggal) */}
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[15px] font-semibold mt-1">
                          
                          {/* JIKA ADA WAKTU & LOKASI (Biasanya Kegiatan/Rapat) */}
                          {event.waktu && (
                            <div className="flex items-center gap-2">
                              <FiClock className="text-lg" />
                              <span>{event.waktu}</span>
                            </div>
                          )}
                          {event.lokasi && (
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-lg" />
                              <span>{event.lokasi}</span>
                            </div>
                          )}

                          {/* JIKA ADA TANGGAL MULAI & SELESAI (Biasanya Todo) */}
                          {event.start_date && (
                            <div>
                              Start Date : {event.start_date.split('T')[0]}
                            </div>
                          )}
                          {event.deadline && (
                            <div className="text-[#FF5252]">
                              End Date : {event.deadline.split('T')[0]}
                            </div>
                          )}

                        </div>
                      </div>

                      {/* ALERT SISA HARI (Berada di luar kotak kanan, persis gambar) */}
                      {alertText && (
                        <div className="flex items-center gap-2 text-[#EF4444] font-bold text-lg flex-shrink-0 md:w-48">
                          <FiAlertCircle className="text-3xl stroke-[2.5]" />
                          <span>{alertText}</span>
                        </div>
                      )}

                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic font-semibold">Tidak ada kegiatan pada tanggal ini.</p>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}