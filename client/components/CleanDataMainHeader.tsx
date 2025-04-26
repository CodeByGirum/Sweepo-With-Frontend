"use client"

import { useGlobalContext } from "@/context/context"
import { DeleteAction, DeleteAllAction } from "@/utils/cleanDataActions";
import { IoClose } from "react-icons/io5";
import {Action} from "../utils/types"
import { useEffect, useState } from "react";
import SmallLoading from "./SmallLoading";

const CleanDataMainHeader = () => {
    const[currentAction, setCurrentAction] = useState<number>(-1);
    const[loading, setLoading] = useState<boolean>(false);
    const {actions, isCleanDataLoading, refreshWorkstation, setRefreshWorkstation, cleanDataFileId} = useGlobalContext();

    const sortedActions = [...(actions as Action[])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const handleUndo = async(actionId:string) => {
        setLoading(true);
        const response = await DeleteAction(cleanDataFileId,actionId);

        if(response){
            const {data} = response;

            if(data.status){
                setRefreshWorkstation(!refreshWorkstation)
            }
        }
        
    }

    useEffect(()=>{
        setCurrentAction(-1);
        setLoading(false);
    },[actions])

    const handleAllUndo = async() => {
        
        const response = await DeleteAllAction(cleanDataFileId);

        if(response){
            const {data} = response;

            if(data.status){
                setRefreshWorkstation(!refreshWorkstation)
            }
        }
    }
    
  return (
    <header className='flex justify-between items-center bg-black p-1 px-5 w-full h-10 border-b border-gray-300'>
        <button className="p-2 rounded-lg max-w-[80%] bg-[#1E1E1E] text-secondary-foreground text-nowrap text-sm text-bold mr-5 hover:underline" onClick={handleAllUndo}>
            Undo All&nbsp;({actions.length})
        </button>
        <div className="flex flex-nowrap w-full gap-2 hover:overflow-x-auto custom-scrollbar bg-black p-1">
        {
            actions?.length > 0 ? sortedActions.map((action, index) => (
                <div className="flex gap-1"  key={index}>
                    <div
                        className={`p-1 rounded-lg flex items-center gap-1 text-nowrap text-sm w-auto ${
                            action.chat !== null 
                                ? "bg-[#1E1E1E] text-secondary-foreground"
                                : "mr-auto bg-secondary text-secondary-foreground"
                        }`}
                    >
                        <div className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer" onClick={()=>handleUndo(action.action_id)}>{(currentAction === index && loading) ? <SmallLoading/> :<IoClose onClick={()=>setCurrentAction(index)}/>}</div>{action.title}
                    </div>
                </div>
            ))
            : <div className={`p-2 rounded-lg text-wrap text-sm max-w-[80%]mr-auto bg-secondary text-secondary-foreground"
            }`}
            >
                {isCleanDataLoading || "No Action taken"}
            </div>
        }
        </div>
    </header>
  )
}

export default CleanDataMainHeader