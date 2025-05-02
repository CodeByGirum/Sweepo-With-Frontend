"use client"

import { FaDownload } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { LuShrink } from "react-icons/lu";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { FaRegWindowClose } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

const COLORS = {INVALID_VALUE:"#FF5733",TYPE_MISMATCH:"#FFC300",NULL_VALUE:"#36A2EB",DUPLICATE_VALUE:"#4CAF50",INVALID_FORMAT:"#9C27B0",INVALID_SEPARATOR:"#FF9800",INVALID_DATE: "#E53935"}


const CleanDataTableHeader = ({expand,setExpand}:{expand:boolean,setExpand:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [row, setRow] = useState<string>("50")

    const handlePagination = (increase: boolean) => {
        setRow(prev => {
            const currentValue = Number(prev);
            const newValue = increase ? currentValue + 50 : currentValue - 50;
            return newValue < 0 ? "0" : String(newValue);
        });
    };
    
  return (
    <header className='flex justify-between items-center sectionBg p-1 px-5 w-full sticky right-0 left-0'>
        <div className='flex justify-between items-center gap-1'>
                <span>show:</span>
                <span className='flex justify-between items-center gap-1'>
                <FaAngleLeft onClick={()=>handlePagination(false)} className="cursor-pointer" />
                <input type="text" value={row} onChange={(e)=>setRow(e.target.value)} min={0} className='w-14 bg-transparent border text-sm border-gray-400 rounded-md focus:outline-none' /><FaAngleRight onClick={()=>handlePagination(true)} className="cursor-pointer" />
                </span>
        </div>
        {/* grid-cols-3 */}
        <ul className="grid grid-cols-4 gap-1 md:hidden lg:grid">
            {Object.entries(COLORS).map(([key, value]) => (
                <li key={key} className="flex items-center gap-1">
                    <span className="min-w-4 min-h-4 rounded" style={{ backgroundColor: value }}></span>
                    <span className="text-[10px]">{key}</span>
                </li>
            ))}
        </ul>


        


        <div className='flex justify-between items-center gap-3'>
            <IoMdShare className="cursor-pointer" />
            <FaDownload className="cursor-pointer" />
            {
                expand
                ?  <LuShrink onClick={()=>setExpand(false)} className="cursor-pointer" />
                :   <LuExpand onClick={()=>setExpand(true)} className="cursor-pointer" />
            }
            <BsThreeDots className="cursor-pointer" />
            <Link href={"/projects"}>
                <FaRegWindowClose className="cursor-pointer" />
            </Link>
        </div>
    </header>
  )
}

export default CleanDataTableHeader