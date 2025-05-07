// ChatInput.tsx
import { FC, useRef } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
};

const ChatInput: FC<ChatInputProps> = ({ input, setInput, sendMessage }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) console.log("Selected file:", file.name);
    };

    return (
        <div className="flex sticky bottom-0 border-t border-gray-800 z-10">
            <div className="secondaryBg m-1 p-2 rounded-lg flex items-start gap-1 w-full">
                <button type="button" className="text-gray-600 hover:text-gray-800" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} accept=".csv,.txt,.xlsx,.json" className="hidden" onChange={handleFileSelect} />
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.ctrlKey) {
                            e.preventDefault();
                            sendMessage();
                        } else if (e.key === "Enter" && e.ctrlKey) {
                            setInput((prev) => prev + "\n");
                        }
                    }}
                    placeholder="Ask a follow up..."
                    className="flex-1 resize-none border-none focus:outline-none custom-scrollbar break-all"
                />
                <button type="button" className="text-primary hover:text-primary-dark" onClick={sendMessage}>
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;