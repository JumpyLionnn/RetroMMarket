function api(req: ExpressRequest, res: ExpressResponse, next: () => void) {
    requests++;
    next();
}