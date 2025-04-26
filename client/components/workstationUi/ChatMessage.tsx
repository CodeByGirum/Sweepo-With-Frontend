// // ChatMessage.tsx
// import { Edit } from "lucide-react";
// import { FC } from "react";

// type ChatMessageProps = {
//     action: { chat: string; response: string };
//     setInput: (value: string) => void;
// };

// const ChatMessage: FC<ChatMessageProps> = ({ action, setInput }) => (
//     <div className="flex flex-col gap-1">
//         <div className="flex gap-1 max-w-4/5 w-48 ml-auto items-center">
//             <span className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer" onClick={() => setInput(action.chat)}>
//                 <Edit />
//             </span>
//             <div className="p-1 rounded-lg flex items-center break-all text-sm w-auto bg-primary text-primary-foreground">
//                 {action.chat}
//             </div>
//         </div>
//         <div className="p-1 rounded-lg flex items-center gap-1 text-sm mr-auto bg-secondary text-secondary-foreground w-4/5 break-all">
//             {action.response}
//         </div>
//     </div>
// );

// export default ChatMessage;



// import { useEffect, useRef, useState } from "react";
// import { Edit } from "lucide-react";
// import { FC } from "react";

// type ChatMessageProps = {
//   action: { chat: string; response: string };
//   setInput: (value: string) => void;
// };

// const ChatMessage: FC<ChatMessageProps> = ({ action, setInput }) => {
//   const [typedText, setTypedText] = useState("");
//   const containerRef = useRef<HTMLDivElement>(null);
//   const indexRef = useRef(0);
//   const animationRef = useRef<number | null>(null);

//   console.log("action", action);
  
//   useEffect(() => {
//     setTypedText("");
//     indexRef.current = 0;

//     const type = () => {
//       if (indexRef.current <= action.response.length) {
//         setTypedText(action.response.slice(0, indexRef.current));
//         indexRef.current++;
//         animationRef.current = requestAnimationFrame(type);
//       }
//     };

//     animationRef.current = requestAnimationFrame(type);

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [action.response]);

//   // Scroll as it types
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [typedText]);
  

//   return (
//     <div className="flex flex-col gap-1">
//       <div className="flex gap-1 max-w-4/5 w-48 ml-auto items-center">
//         <span
//           className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer"
//           onClick={() => setInput(action.chat)}
//         >
//           <Edit />
//         </span>
//         <div className="p-1 rounded-lg flex items-center break-all text-sm w-auto bg-primary text-primary-foreground">
//           {action.chat}
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         // className="p-1 rounded-lg flex items-start gap-1 text-sm mr-auto bg-secondary text-secondary-foreground w-4/5 max-h-60 overflow-y-auto break-words whitespace-pre-wrap"
//         className="p-2 rounded-lg text-sm bg-secondary text-secondary-foreground w-full max-w-[90%] mr-auto overflow-y-auto break-words whitespace-pre-wrap max-h-60"
//       >
//         {typedText}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;



import { useEffect, useRef, useState } from "react";
import { Edit } from "lucide-react";
import { FC } from "react";


type ChatMessageProps = {
    action: { chat: string; response: string, summary: string };
    setInput: (value: string) => void;
    scrollAreaRef?: React.RefObject<HTMLDivElement | null>;
    shouldAnimate?: boolean;
  };
  
  const ChatMessage: FC<ChatMessageProps> = ({ action, setInput, scrollAreaRef, shouldAnimate }) => {
    const [typedText, setTypedText] = useState(shouldAnimate ? "" : action.summary);
    const indexRef = useRef(0);
    const animationRef = useRef<number | null>(null);
  
    useEffect(() => {
      if (!shouldAnimate) return; // ✅ Skip animation if false
  
      indexRef.current = 0;
  
      const type = () => {
        if (indexRef.current <= action.summary.length) {
          setTypedText(action.summary.slice(0, indexRef.current));
          indexRef.current++;
  
          // ✅ Scroll the outer container
          if (scrollAreaRef?.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
          }
  
          animationRef.current = requestAnimationFrame(type);
        }
      };
  
      animationRef.current = requestAnimationFrame(type);
  
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }, [action.summary, shouldAnimate]);
  
    return (
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 max-w-4/5 w-48 ml-auto items-center">
          <span
            className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer"
            onClick={() => setInput(action.chat)}
          >
            <Edit />
          </span>
          <div className="p-1 rounded-lg flex items-center break-all text-sm w-auto bg-[#1E1E1E] text-secondary-foreground">
            {action.chat}
          </div>
        </div>
  
        <div
          className="p-2 rounded-lg text-sm text-secondary-foreground w-full max-w-[90%] mr-auto break-words whitespace-pre-wrap"
        >
          {typedText}
        </div>
      </div>
    );
  };
  
  export default ChatMessage;
  