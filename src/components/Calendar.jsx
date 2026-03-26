import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FiX } from 'react-icons/fi';

// 1. Terima viewMode dari props
export default function Calendar({ viewMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  // HAPUS baris const [viewMode, setViewMode] = useState('global'); karena sudah ada di props!

  const dummyEvents = [
    { title: 'Global', date: '2026-05-01', backgroundColor: '#EF4444', type: 'global' },
    { title: 'MIT', date: '2026-05-09', backgroundColor: '#67E8F9', type: 'divisi' },
    // ... (data dummy lainnya tetap sama)
  ];

  const displayedEvents = dummyEvents.filter((event) => {
    if (viewMode === 'global') return event.type === 'global';
    return event.type === 'divisi';
  });

  // FUNGSI SAAT TANGGAL DIKLIK
  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr; 

    // Filter dari daftar event yang sedang TAMPIL saja
    const eventsOnThisDay = displayedEvents.filter((event) => event.date === clickedDate);

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
      
      {/* HAPUS KODE TOMBOL SWITCH (div absolute) DARI SINI */}

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
        fixedWeekCount={false}
      />

      {/* AREA KETERANGAN (LEGEND) BAWAH */}
      <div className="mt-8 border-t-2 border-[#133F25] pt-4">
        {/* ... (Isi legend sama seperti sebelumnya) ... */}
        <p className="text-sm font-extrabold text-[#133F25] mb-2">Ket :</p>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-black uppercase">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#EF4444]"></div> = Global</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#67E8F9]"></div> = MIT</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#FBBF24]"></div> = Cofas</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#4ADE80]"></div> = RND</div>
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