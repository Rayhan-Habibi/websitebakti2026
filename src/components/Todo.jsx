import React from 'react'

function Todo() {
  const dummyTodos = [
    "Buat WEB dengan standar operasional",
    "Buat WEB dengan standar operasional",
    "Buat WEB dengan standar operasional",
    "Buat WEB dengan standar operasional",
    "Buat WEB dengan standar operasional",
  ];

  return (
    // BUNGKUS UTAMA: Border tipis, shadow, dan overflow-hidden agar header mengikuti lengkungan
    <div className="w-full bg-white border-2 border-gray-200 shadow-sm overflow-hidden font-sans">
      
      {/* HEADER HIJAU GELAP */}
      <div className="bg-[#133F25] py-4">
        <h2 className="text-white text-center text-3xl font-black tracking-widest uppercase">
          TO-DO
        </h2>
      </div>

      {/* DAFTAR TUGAS */}
      <ul className="flex flex-col">
        {dummyTodos.map((todo, index) => (
          <li 
            key={index} 
            // Tambahkan border bawah hanya jika bukan item terakhir
            className={`flex items-center gap-4 px-6 py-5 ${
              index !== dummyTodos.length - 1 ? 'border-b-2 border-[#133F25]' : ''
            }`}
          >
            {/* BULLET POINT (Lingkaran Hijau) */}
            <div className="w-4 h-4 rounded-full bg-[#133F25] flex-shrink-0"></div>
            
            {/* TEKS TUGAS */}
            <span className="text-lg font-semibold text-[#133F25]">
              {todo}
            </span>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default Todo