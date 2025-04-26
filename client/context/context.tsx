'use client'

import { CleanData } from "@/utils/cleanDataActions";
import { createContext, useState, useContext, useEffect } from "react";
import {Action, RecordType, Issue, Payload, Schema, } from "../utils/types"


interface UserContextType {
    user: Payload | null;
    setUser: React.Dispatch<React.SetStateAction<Payload | null>>;
    expand: boolean;
    setExpand:React.Dispatch<React.SetStateAction<boolean>>;
    setRefreshWorkstation:React.Dispatch<React.SetStateAction<boolean>>;
    cleanDataFileId: string;
    chat: string;
    setChat:React.Dispatch<React.SetStateAction<string>>;
    responseWarning: string;
    setResponseWarning:React.Dispatch<React.SetStateAction<string>>;
    setCleanDataFileId:React.Dispatch<React.SetStateAction<string>>;
    records: RecordType[];
    issues: Issue[];
    actions: Action[];
    summary: Action[];
    schema: Schema;
    insertMessage: (message: string) => void;
    isCleanDataLoading:boolean;
    refreshWorkstation:boolean;
    selectedRow:number;
    setSelectedRow:React.Dispatch<React.SetStateAction<number>>;
    
}

const getUniqueChatActions = (actions: Action[]) => {
    const seen = new Set();
    return actions.filter(action => {
      if (seen.has(action.chat)) return false;
      seen.add(action.chat);
      return true;
    });
  };
  
  

const UserContext = createContext<UserContextType | null>(null);

const ContextAPI: React.FC<{children:React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<Payload | null>(null);
    const [expand, setExpand] = useState<boolean>(false);
    const [schema, setSchema] = useState({});
    const [records, setRecords] = useState<RecordType[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [summary, setSummary] = useState<Action[]>([]);
    const [chat, setChat] = useState<string>("");
    const [responseWarning, setResponseWarning] = useState<string>("");
    const [cleanDataFileId, setCleanDataFileId] = useState<string>("");
    const [isCleanDataLoading, setIsCleanDataLoading] = useState<boolean>(true);
    const [refreshWorkstation, setRefreshWorkstation] = useState<boolean>(true);
    const [selectedRow, setSelectedRow] = useState<number>(0);

    useEffect(() => {
        const getUserFromCookies = () => {
            try {
                const cookies = document.cookie.split("; ");
                const payloadCookie = cookies.find(row => row.startsWith("payload="));

                if (payloadCookie) {
                    const payloadValue = payloadCookie.split("=")[1];
                    const parsedPayload: Payload = JSON.parse(decodeURIComponent(payloadValue)); 
                    setUser(parsedPayload);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if(!user){
            getUserFromCookies();
        }

    }, [user]);

    useEffect(()=>{
        const fetchCleanDataResponse = async() => {
            setIsCleanDataLoading(true);

            
            const response = await CleanData(cleanDataFileId,chat);
            
            if(Object.keys(response).length > 0){
                const {success, data} = response;
                
                if(success){
                    const {actions, issues, records, schema} = data;
                    const distinctActions = getUniqueChatActions(actions);
                    console.log("distinctActions", distinctActions);
                    
                    setActions(actions);
                    setSummary(distinctActions);
                    setIssues(issues);
                    setRecords(records);
                    setSchema(schema);
                    setChat("");
                    setResponseWarning("");
                    setSelectedRow(0);
                }else if(!success && response.status === 200){
                    const {message} = response;
                    setResponseWarning(message);
                }else{
                    console.log(response.message);
                    
                }
            }

            setIsCleanDataLoading(false);
            
        }

        fetchCleanDataResponse();
    },[chat,cleanDataFileId, refreshWorkstation]);

    const insertMessage = (message:string) => {   
        setChat(message)
    }



    return (
        <UserContext.Provider value={{user, setUser, expand, setExpand, chat, setChat, schema, actions, records, issues, insertMessage, setCleanDataFileId, cleanDataFileId, isCleanDataLoading,setRefreshWorkstation, refreshWorkstation, selectedRow, setSelectedRow,responseWarning,setResponseWarning, summary}}>
            {children}
        </UserContext.Provider>
    )
}

export const useGlobalContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextAPI provider");
    }
    return context;
}


export default ContextAPI;