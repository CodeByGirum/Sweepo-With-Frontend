// ChatLoader.tsx
const ChatLoader = ({message="AI is processing your request"}:{message?:string}) => (
    <div className="p-2 rounded-lg flex justify-center items-center gap-1 text-sm mr-auto text-secondary-foreground w-full animate-pulse mt-2">
        {message}<span className="dot-flash">...</span>
    </div>
);

export default ChatLoader;
