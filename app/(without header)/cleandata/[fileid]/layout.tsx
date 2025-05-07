"use client"

import CleanDataMainHeader from "@/components/CleanDataMainHeader";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGlobalContext } from "@/context/context";
import { useEffect } from "react";

export default function CleanDataLayout({
    sidemenu,
    chat,
    table,
}: {
    sidemenu: React.ReactNode;
    chat: React.ReactNode;
    table: React.ReactNode;
}) {        
    const {expand} = useGlobalContext();

    useEffect(() => {
        if (expand) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [expand]);


        // ${expand || 'h-[calc(100vh-70px)]'}
        // className={`w-screen border-t border-b border-gray-800 overflow-hidden h-[calc(100vh-40px)]`} 
    return <>
        <div className="w-screen border-t border-b border-gray-800 flex flex-col overflow-hidden h-screen">
            {expand ? (
                table
            ) : <>
                <CleanDataMainHeader/>
                <div className="h-[calc(100vh-40px)]">
                    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                        <ResizablePanel defaultSize={15} className="border-r border-gray-800 overflow-y-auto">
                            {sidemenu}
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={20} className="border-r border-gray-800">
                            {chat}
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        {/* className="sticky right-0 h-full w-full" */}
                        <ResizablePanel defaultSize={65}>
                            <div className="flex flex-1 h-full w-full">
                                {table}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                </>}
        </div>
    </>;
}
