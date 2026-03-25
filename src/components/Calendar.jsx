import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FiX } from 'react-icons/fi'; // Pastikan sudah npm install react-icons

export default function Calendar() {
  // 1. STATE UNTUK POP-UP MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);

  // DATA DUMMY (Aku tambahkan data tanggal 21 sesuai gambarmu)
  const dummyEvents = [
    { title: 'Global', date: '2026-05-01', backgroundColor: '#EF4444' },
    { title: 'MIT', date: '2026-05-09', backgroundColor: '#67E8F9' },
    { title: 'Cofas', date: '2026-05-09', backgroundColor: '#FBBF24' },
    { title: 'RND', date: '2026-05-09', backgroundColor: '#4ADE80' },
    // Data untuk tanggal 21 Mei
    { title: 'Rapat Global 1 X SC X INTI', date: '2026-05-21', backgroundColor: '#991B1B' }, // Merah gelap
    { title: 'To-Do List Dari Divisi RNB', date: '2026-05-21', backgroundColor: '#1E3A8A' }, // Biru gelap
    { title: 'Global', date: '2026-05-30', backgroundColor: '#EF4444' },
  ];

  // 2. FUNGSI SAAT TANGGAL DIKLIK
  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr; // Format bawaan: "2026-05-21"

    // Filter event yang tanggalnya sama dengan yang diklik
    const eventsOnThisDay = dummyEvents.filter((event) => event.date === clickedDate);

    // Format tanggal untuk judul (Misal: "21 MAY 2026")
    const dateObj = new Date(clickedDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    
    setSelectedDateStr(`${day} ${month} ${year}`);
    setSelectedEvents(eventsOnThisDay);
    setIsModalOpen(true); // Tampilkan pop-up
  };

  // Fungsi mengubah wujud event jadi kotak kecil
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
    <div className="w-full bg-white shadow-lg border border-green-900/10 p-6 font-sans flex flex-col relative">
      
      {/* AREA KALENDER */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={dummyEvents}
        dateClick={handleDateClick} // <-- Panggil fungsi klik di sini
        headerToolbar={{
          left: '',
          center: 'prev title next', // Pakai SPASI ya!
          right: ''
        }}
        dayHeaders={false} 
        eventContent={renderKotakWarna}
        contentHeight="auto"
        fixedWeekCount={false}
      />

      {/* AREA KETERANGAN (LEGEND) */}
      {/* AREA KETERANGAN (LEGEND) BAWAH */}
      <div className="mt-8 border-t-2 border-[#133F25] pt-4">
        <p className="text-sm font-extrabold text-[#133F25] mb-2">Ket :</p>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-black uppercase">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#EF4444]"></div> = Global</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#67E8F9]"></div> = MIT</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#FBBF24]"></div> = Cofas</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#4ADE80]"></div> = RND</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#D946EF]"></div> = xxx</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#3B82F6]"></div> = xxxx</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#FBBF24]"></div> = xxx</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#4ADE80]"></div> = xxx</div>
        </div>
      </div>

      {/* 3. KOMPONEN POP-UP MODAL */}
      {isModalOpen && (
        // Latar Belakang Gelap (Backdrop)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-15">
          
          {/* Kotak Putih Pop-up */}
          <div className="bg-white w-full max-w-5xl p-8 relative shadow-2xl transform transition-all">
            
            {/* Tombol Silang (Close) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#133F25] hover:text-red-500 transition-colors"
            >
              <FiX className="text-3xl" />
            </button>

            {/* Judul Tanggal (Dengan garis bawah hijau) */}
            <h2 className="text-3xl font-extrabold text-[#133F25] border-b-2 border-[#81C784] w-fit pb-1 mb-6">
              {selectedDateStr}
            </h2>

            {/* Daftar Event (Badge/Pill) */}
            <div className="space-y-3">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="px-5 py-3 text-white font-semibold text-lg shadow-md transition-transform hover:-translate-y-0.5"
                    style={{ 
                      // Menggunakan background color langsung dari data
                      backgroundColor: event.backgroundColor,
                      // Opsional: Bikin gradien tipis agar persis gambar
                      backgroundImage: `linear-gradient(to right, ${event.backgroundColor}, #00000030)`
                    }}
                  >
                    {event.title}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Tidak ada kegiatan pada tanggal ini.</p>
              )}
            </div>
            
          </div>
        </div>
      )}

      

    </div>
  );
}