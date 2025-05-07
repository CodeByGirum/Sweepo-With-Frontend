import React from 'react'
import { IoFilterSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const Header = ({
    search, 
    setSearch,
    dropdownRef,
    viewCategory,
    setViewCategory,
    selectedCategory, 
    setSelectedCategory,
    setShowOverlay
}:{
    search:string,
    setSearch:React.Dispatch<React.SetStateAction<string>>,
    dropdownRef:React.RefObject<HTMLDivElement | null>,
    viewCategory:boolean,
    setViewCategory:React.Dispatch<React.SetStateAction<boolean>>,
    selectedCategory:string | null,
    setSelectedCategory:React.Dispatch<React.SetStateAction<string | null>>
    setShowOverlay:React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <header className="secondaryBg w-full h-15 flex justify-center sm:justify-end items-center py-3 px-6 rounded-lg">
        <div className="flex sm:flex-row gap-4 items-center">
        <form onSubmit={(e) => e.preventDefault()}>
            <input
            type="text"
            className="input sm:max-w-30"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </form>
        <div className="relative" ref={dropdownRef}>
            <IoFilterSharp className="text-2xl cursor-pointer" onClick={()=>setViewCategory(!viewCategory)} />
            {
                viewCategory && (
                <ul className="absolute top-full background py-4 px-2 w-40 rounded-lg flex flex-col" >
                    <li 
                    className={`border-b hover:secondaryBg cursor-pointer text-sm px-1 py-2 rounded-sm ${
                        selectedCategory === "Machine Learning" ? "font-bold primary secondaryBg" : "heading"
                    }`}
                    onClick={() => setSelectedCategory("Machine Learning")}
                    >
                        Machine Learning
                    </li>
                    <li 
                    className={`border-b hover:opacity-75 cursor-pointer text-sm px-1 py-2 rounded-sm ${
                        selectedCategory === "Analytics" ? "font-bold primary secondaryBg" : "heading"
                    }`}
                    onClick={() => setSelectedCategory("Analytics")}
                    >
                    Analytics
                    </li>
                    <li
                    className="heading hover:opacity-75 cursor-pointer bg-red-500 text-sm px-1 py-2 rounded-sm"
                    onClick={() => setSelectedCategory(null)}
                    >
                    Reset Filter
                    </li>
                </ul>
                )
            }
        </div>
        <button className="primaryBtn primaryBtnTxt flex gap-1 items-center text-sm" onClick={()=>setShowOverlay(true)}><IoMdAdd className="text-xl" /><span className="hidden sm:block">New project</span></button>
        </div>
    </header>
  )
}

export default Header