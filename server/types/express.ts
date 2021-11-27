declare interface ExpressResponse{
    send: (message: any) => void;
    sendFile: (filePath: string) => void;
    render: (filePath: string, templateVariables: any) => void;
    json: (object: {[key: string]: string | boolean | number}) => void;
    status: (statusCode: number) => ExpressResponse;
    header: (field: string, value: string) => void;
    redirect: (path: string) => void;
    cookie: (key: string, value: string) => void;
};

declare interface ExpressRequest{
    body: {[key: string]: any};
    header: (name: string) => string;
    [name: string]: any;
}