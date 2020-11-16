import { downloadAndUnzipVSCode } from "vscode-test";

import * as vscode from 'vscode';

export function getDeprecatedAPIcall(currentLine:string, apiElements: string){
    let apiElementsList = apiElements.split('.');
    let len:number = apiElementsList.length;
    let str:string = apiElementsList[len-1].replace("()","");
    str = str.replace("\n","");
    str = str.replace(" ","");
    // console.log(currentLine,str.length, str, currentLine.indexOf(str), currentLine.includes(str));
    if(currentLine.includes(str)){
        console.log("deprecated - ",currentLine);
        return str;
    }
    return "-1";
}
export function readContents(currentLine:string){
    let filepath:string = "D:/RISHA/vscode_extension/APIScanner/src/commands/deprecated_list.txt";
    let doc = vscode.workspace.openTextDocument(vscode.Uri.file(filepath));
    // let strArr:string[] = [];
    doc.then(document => {
        let localApiCalls:string = document.getText();
        var localApiCallsStringArr = localApiCalls.split("\n");
        for(let i=0; i<localApiCallsStringArr.length;i++){
            let str:string = getDeprecatedAPIcall(currentLine,localApiCallsStringArr[i]);
            // console.log("str - rc - ",str);
            if(str.indexOf("-1")===-1){
                // console.log("here !!!");
                return str; 
            };
        }
    });
    // return "-1";
}