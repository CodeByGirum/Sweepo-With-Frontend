// ChatWarning.tsx
import { FC } from "react";

type ChatWarningProps = {
    message: string;
};

const ChatWarning: FC<ChatWarningProps> = ({ message }) => (
    <div className="p-1 rounded-lg flex items-center gap-1 text-sm mr-auto text-secondary-foreground w-4/5 bg-red-600/70 font-medium">
        {message}
    </div>
);

export default ChatWarning;
