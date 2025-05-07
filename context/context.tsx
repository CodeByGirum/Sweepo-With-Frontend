/**
 * Global Context Provider
 * Purpose: Manages global application state and data flow
 * Used in: Application-wide state management
 * Features:
 * - User authentication state
 * - Data cleaning operations
 * - Chat and response handling
 * - Schema and records management
 * - UI state management
 */

'use client'

import { CleanData } from "@/utils/cleanDataActions";
import { createContext, useState, useContext, useEffect } from "react";
import {Action, RecordType, Issue, Payload, Schema, } from "../utils/types"

/**
 * Interface defining the shape of the global context
 * @property user - Current authenticated user data
 * @property setUser - Function to update user state
 * @property expand - UI expansion state
 * @property setExpand - Function to update expansion state
 * @property setRefreshWorkstation - Function to trigger workstation refresh
 * @property cleanDataFileId - ID of the current data file being cleaned
 * @property chat - Current chat message
 * @property setChat - Function to update chat message
 * @property responseWarning - Warning message from server responses
 * @property setResponseWarning - Function to update warning message
 * @property setCleanDataFileId - Function to update data file ID
 * @property records - Array of data records
 * @property issues - Array of data issues
 * @property actions - Array of cleaning actions
 * @property summary - Summary of unique cleaning actions
 * @property schema - Data schema definition
 * @property insertMessage - Function to insert new chat message
 * @property isCleanDataLoading - Loading state for data cleaning
 * @property refreshWorkstation - Workstation refresh trigger
 * @property selectedRow - Currently selected row index
 * @property setSelectedRow - Function to update selected row
 */
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

/**
 * Filters actions to get unique chat messages
 * @param actions - Array of cleaning actions
 * @returns Array of actions with unique chat messages
 */
const getUniqueChatActions = (actions: Action[]) => {
    const seen = new Set();
    return actions.filter(action => {
      if (seen.has(action.chat)) return false;
      seen.add(action.chat);
      return true;
    });
};

const UserContext = createContext<UserContextType | null>(null);

/**
 * Context Provider Component
 * @param children - React children components
 * @description
 * - Manages global application state
 * - Handles user authentication
 * - Processes data cleaning operations
 * - Manages chat interactions
 * - Provides context to child components
 */
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

            
            try {
                const response = await CleanData(cleanDataFileId,chat);
                
                if(Object.keys(response).length > 0){
                    const {success, data} = response;
                    
                    if(success){
                        const {actions, issues, records, schema} = data;
                        const distinctActions = getUniqueChatActions(actions);
                        
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
                        setResponseWarning(response.message || "An error occurred while processing your request");
                    }
                }
            } catch (error) {
                console.error("Error fetching clean data:", error);
                setResponseWarning("Network error or server is not available. Please try again later.");
            } finally {
                setIsCleanDataLoading(false);
            }
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

/**
 * Custom hook to access global context
 * @returns UserContextType
 * @throws Error if used outside of ContextAPI provider
 */
export const useGlobalContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextAPI provider");
    }
    return context;
}

export default ContextAPI;