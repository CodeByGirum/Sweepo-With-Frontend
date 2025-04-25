// // Chat.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useGlobalContext } from "@/context/context";
// import ChatMessage from "@/components/workstationUi/ChatMessage";
// import ChatInput from "@/components/workstationUi/ChatInput";
// import ChatWarning from "@/components/workstationUi/ChatWarning";
// import ChatLoader from "@/components/workstationUi/ChatLoader";

// const Chat = () => {
//     const [input, setInput] = useState("");
//     const { insertMessage, chat, isCleanDataLoading, actions, responseWarning } = useGlobalContext();
//     const messagesEndRef = useRef<HTMLDivElement | null>(null);

//     const sendMessage = () => {
//         if (!input.trim()) return;
//         insertMessage(input);
//         setInput("");
//     };

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [chat, isCleanDataLoading]);

//     return (
//         <Card className="w-full h-full flex border-none flex-col relative">
//             <CardHeader className="text-lg font-semibold border-b border-gray-800 p-1">Chat</CardHeader>
//             <CardContent className="h-full overflow-hidden border-none mt-4 relative">
//                 <ScrollArea className="w-full h-full">
//                     <div className="space-y-2">
//                         {actions?.length > 0 ? (
//                             actions.map((action, index) => (
//                                 <ChatMessage key={index} action={action} setInput={setInput} />
//                             ))
//                         ) : (
//                             <div className="p-2 rounded-lg text-wrap text-sm max-w-[80%] mr-auto bg-secondary text-secondary-foreground">
//                                 {isCleanDataLoading || "No Messages"}
//                             </div>
//                         )}

//                         {responseWarning && <ChatWarning message={responseWarning} />}
//                         {isCleanDataLoading && <ChatLoader />}

//                         <div ref={messagesEndRef} />
//                     </div>
//                 </ScrollArea>
//             </CardContent>
//             <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
//         </Card>
//     );
// };

// export default Chat;

"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalContext } from "@/context/context";
import ChatMessage from "@/components/workstationUi/ChatMessage";
import ChatInput from "@/components/workstationUi/ChatInput";
import ChatWarning from "@/components/workstationUi/ChatWarning";
import ChatLoader from "@/components/workstationUi/ChatLoader";


const Chat = () => {
    const [input, setInput] = useState("");
    const { insertMessage, chat, isCleanDataLoading, actions, responseWarning } = useGlobalContext();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null); 
  
    const sendMessage = () => {
      if (!input.trim()) return;
      insertMessage(input);
      setInput("");
    };
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isCleanDataLoading]);
  
    return (
      <Card className="w-full h-full flex border-none flex-col relative">
        <CardHeader className="text-lg font-semibold border-b border-gray-800 p-1">Chat</CardHeader>
        <CardContent className="h-full overflow-hidden border-none mt-4 relative">
          <ScrollArea className="w-full h-full" ref={scrollAreaRef}> {/* 👈 Set the ref */}
            <div className="space-y-2">
              {actions?.length > 0 ? (
                actions.map((action, index) => (
                  <ChatMessage
                    key={index}
                    action={action}
                    setInput={setInput}
                    scrollAreaRef={scrollAreaRef} 
                    shouldAnimate={index === actions.length - 1}
                  />
                ))
              ) : (
                <div className="p-2 rounded-lg text-wrap text-sm max-w-[80%] mr-auto bg-secondary text-secondary-foreground">
                  {isCleanDataLoading || "No Messages"}
                </div>
              )}
  
              {responseWarning && <ChatWarning message={responseWarning} />}
              {isCleanDataLoading && <ChatLoader />}
  
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
      </Card>
    );
  };

  export default Chat;
  