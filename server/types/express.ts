declare interface Response{
    send: (message: string) => void;
    sendFile: (path: string) => void;
};