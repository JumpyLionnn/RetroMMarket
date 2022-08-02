const jsdom = require("jsdom");
const fetchRequest = require("cross-fetch");
const { JSDOM } = jsdom;
const fs = require("fs");
const https = require('https');



function isNumeric(str: string) {
    return !isNaN(+str)
}

function isBoolean(str: string){
    const lower = str.toLowerCase();
    return lower === "true" || lower === "false";
}

function isBooleanable(str: string){
    const lower = str.toLowerCase();
    return lower === "true" || lower === "false" || lower === "yes" || lower === "no";
}

function toBoolean(str: string){
    switch (str.toLowerCase()) {
        case "true":
            case "yes":
                return true;
                case "false":
        case "no":
            return false;
        default:
            return null;
        }
    }
    
function getCategory(properties: {[name: string]: boolean | number | string}){
    if(properties.Slot === "Main Hand"){
        return "Weapons";
    }
    
    if(properties.Consumable){
        return "Consumables";
    }
    
    if(properties.Cosmetic){
        return "Cosmetics";
    }
    
    if(properties.Slot === "Off Hand" || properties.Slot === "Head" || properties.Slot === "Body"){
        return "Armors";
    }
    
    //console.log(properties);
   // throw new Error("unknown item category");
    console.error("ERROR: unknown item category!!!!!");
    return "unknown";
}


function download(uri: string, filename: string){
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        const request = https.get(uri, (response: any) => {
            response.pipe(file);
    
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                resolve(undefined);
            });
        });
    });
}

const itemPageUrl = "https://wiki.retro-mmo.com/wiki/Category:Items";
const itemIconsDirectoryPath = "client/assets/items";



async function main(){
    // const dom = new JSDOM(await (await fetchRequest(itemPageUrl)).text(), {
    //     contentType: "text/html",
    //     includeNodeLocations: true,
    //     storageQuota: 10000000
    // });

    const dom = await JSDOM.fromURL(itemPageUrl);
    
    const mainDocument = dom.window.document;
    const itemsATags = mainDocument.querySelectorAll("#mw-pages a");

    const items: any = {};

    console.log(itemsATags.length);

    for (let i = 0; i < itemsATags.length; i++) {
        const aTag = itemsATags[i];

        const itemDom: any = await JSDOM.fromURL(aTag.href);
        // extracting properties
        const rawProperties = itemDom.window.document.querySelectorAll("#mw-content-text > div > table > tbody > tr");
        const properties: {[name: string]: boolean | number | string} = {};
        rawProperties.forEach((value: Element) => {
            const row = <HTMLTableRowElement>value;
            if(row.children.length === 2){
                const propertyName = row.firstElementChild!.textContent!.trim();
                const propertyValueText = row.lastElementChild!.textContent!.trim();
                if(isNumeric(propertyValueText)){
                    properties[propertyName] = parseFloat(propertyValueText);
                }
                else if(isBooleanable(propertyValueText)){
                    properties[propertyName] = toBoolean(propertyValueText)!;
                }
                else{
                    properties[propertyName] = propertyValueText;
                }
            }
        });
        if(properties.Tradable){
            const itemName = itemDom.window.document.querySelector("#firstHeading").innerHTML;
            console.log(itemName);
            const imageUrl = itemDom.window.document.querySelector("#mw-content-text > div > table > tbody img").src;
            const category = getCategory(properties);
            const minPrice = properties.Sell || 1;
            const wikiPageUrl = aTag.href;

            const imageName = itemName.replaceAll(" ", "_")
            await download(imageUrl, itemIconsDirectoryPath + "/" + imageName + ".png");
            items[itemName] = {
                "image": "items/" + imageName + ".png",
                "category": category,
                "wiki": wikiPageUrl,
                "minPrice": minPrice
            };
            
        }
    }
    
    itemsATags.forEach(async (aTag: HTMLAnchorElement) => {
        
    });

    console.log(items);
    fs.writeFileSync("server/data/items.json", JSON.stringify(items));
}

main();
