import * as fs from 'fs';

export function runDetectDeprecatedAPI(){
    var shell = require('shelljs');
    var path = require('path');
    shell.cd(path.join(__dirname, "commands/pyScripts/"));
    shell.exec('python main.py');
}
export function getDeprecatedAPIcall(currentLine:string, apiElements:string[]){
    apiElements.forEach(element => {
        let words:string[] = currentLine.split(" ");
        words.forEach(word => {
            console.log(word,element);
            if(element.indexOf(word)!==-1){
                console.log(element);
            }
        });
    });
}
export function readContents(currentLine:string){
    let list:string[] = [];
    const packages = ["sklearn","pandas","numpy","scipy","seaborn","matplotlib"];
    if(currentLine.indexOf("import")!==-1){
        console.log(currentLine);
        for(let i=0;i<packages.length;i++){
            if(currentLine.indexOf(packages[i])!==-1){
                let path = require('path');
                let fp1:string = path.join(__dirname, "commands/pyScripts/output/"+packages[i]+"_deprecated_api_elements.txt");
                fs.readFile(fp1, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    let list1:string[] = data.toString().split("\n");
                    list1.forEach(element => {
                        list.push(element);
                    });
                });
            }
        }
    }
    return list;
}