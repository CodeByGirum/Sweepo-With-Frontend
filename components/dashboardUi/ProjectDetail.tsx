'use client'

import React, { useState } from 'react'
import {projectType} from '../../utils/types'
import Progress from '../Progress';
import ProgressStatus from '../ProgressStatus';
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { DeleteFile } from '@/utils/fileActions';
import Link from 'next/link';
import { useGlobalContext } from '@/context/context';

const ProjectDetail = ({
    project, 
    setShowDetail, 
    showDetail, 
    setRevalidateProjects, 
    revalidateProjects,
    setShowOverlay,
    setStep,
}:{
    project:projectType, 
    setShowDetail:React.Dispatch<React.SetStateAction<boolean>>, 
    showDetail:boolean, setRevalidateProjects:React.Dispatch<boolean>,
    revalidateProjects:boolean,
    setShowOverlay:React.Dispatch<React.SetStateAction<boolean>>
    setStep:React.Dispatch<React.SetStateAction<number>>,
}) => {
    const [loading, setLoading] = useState(false);

    const {file_id,original_name,description,category,progress} = project;
    const {setCleanDataFileId} = useGlobalContext();
    
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        
        if (!confirmDelete) return;
    
        setLoading(true);
        await DeleteFile(file_id);
        setRevalidateProjects(!revalidateProjects);
        setLoading(false);
        setShowDetail(false);
    };
    

  return (
    <div className={`flex flex-col justify-between fixed top-0 right-0 h-full w-full sm:max-w-sm sectionBg shadow-lg z-50 p-6 transform transition-transform duration-300 ease-in-out ${showDetail ? 'translate-x-0' : 'translate-x-full'}`}>
        <div  className={` flex flex-col gap-3`}>
            <IoMdClose className='self-end text-md cursor-pointer' onClick={()=>setShowDetail(false)} />
            <h1 className='text-2xl mb-4'>{original_name}</h1>
            <p className='flex justify-between items-center pb-2 border-b border-gray-700'>
                <span className='text-sm'>Project Type</span>
                <span className='heading text-base'>{category}</span>
            </p>
            <div className='flex flex-col gap-2 pb-2 border-b border-gray-700'>
                <p className='text-sm'>Project Description</p>
                <h1 className='text-base'>{description}</h1>
            </div>
            <div className='flex flex-col gap-2 pb-2 border-b border-gray-700'>
                <p className='text-sm'>Status</p>
                <ProgressStatus progress={progress} />
            </div>
            <div className='flex flex-col gap-2 pb-2 border-b border-gray-700'>
                <p className='text-sm'>Progress</p>
                <Progress progress={progress} />
            </div>
            <a className='hover:primary underline text-sm cursor-pointer' onClick={()=>{setShowOverlay(true);setStep(2);setCleanDataFileId(file_id)}} >Update Schema Type Definition</a>
        </div>
    
        <div className='flex flex-col gap-2 items-center'>
            <Link href={`/errordetection/${file_id}`} type='submit' className='w-full primaryBtn flex gap-3 items-center text-center text-base'>
                <BiError  className='font-bold text-xl' />
                Error Detection
            </Link>
            <button type='submit' className='w-full primaryBtn flex gap-3 items-center text-center bg-red-600 text-base' disabled={loading} onClick={handleDelete}>
                {loading ? (
                    <AiOutlineLoading3Quarters className='animate-spin text-xl' />
                ) : (
                    <MdDelete  className='font-bold text-xl' />
                )}
                Delete
            </button>
        </div>
    </div>
  )
}

export default ProjectDetail