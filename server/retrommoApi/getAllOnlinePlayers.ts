async function getAllOnlinePlayers(){
    return new Promise<string[]>((resolve, reject) =>{
        request("https://play.retro-mmo.com/players.json", { json: true }, (error: Error, res: any, body: string[]) => {
            if (error) { return console.log(error); }
            resolve(body);
        });
    });
}