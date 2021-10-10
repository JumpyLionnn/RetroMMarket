declare interface Response{
    send: (message: string) => void;
    sendFile: (path: string) => void;
};

declare interface Request{
    header: (name: string) => string
}