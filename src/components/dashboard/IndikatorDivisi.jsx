import React from 'react'
import { getDivisiIcon } from '../../utils/divisiIcons';

function IndikatorDivisi({namaDivisi, warna}) {
  return (
    // HAPUS "absolute right-0" dari sini
    <div className="flex flex-col items-center">
          {/* Gunakan style={{ backgroundColor: warna }} agar warnanya dinamis */}
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-sm flex items-center justify-center text-white"
       
          >
            {getDivisiIcon(namaDivisi, "text-black w-6 h-6 md:w-7 md:h-7")}
          </div>
          
          {/* Gunakan variabel {namaDivisi} */}
          <span className="text-xs md:text-sm font-black mt-1 uppercase">
            {namaDivisi}
          </span>
    </div>
  )
}

export default IndikatorDivisi