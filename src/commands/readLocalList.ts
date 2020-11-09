import { downloadAndUnzipVSCode } from "vscode-test";

import * as vscode from 'vscode';
export function getDeprecatedAPIcall(currentLine:string, apiElements: string){
    let apiElementsList = apiElements.split('.');
    let len:number = apiElementsList.length;
    let str:string = apiElementsList[len-1].replace("()","");
    // console.log(typeof currentLine, typeof apiElementsList[len-1]);
    console.log(currentLine, str, currentLine.indexOf(str));
    if(currentLine.includes(str)){
        console.log("deprecated - ",currentLine);
    }
    return false;
}
export function readContents(currentLine:string){
    let filepath:string = "D:/RISHA/vscode_extension/pyddetectorts/src/commands/deprecated_list.txt";
    let doc = vscode.workspace.openTextDocument(vscode.Uri.file(filepath));
    doc.then(document => {
        let localApiCalls:string = document.getText();
        var localApiCallsStringArr = localApiCalls.split("\n");
        for(let i=0; i<localApiCallsStringArr.length;i++){
            getDeprecatedAPIcall(currentLine,localApiCallsStringArr[i]);
        }
        console.log("br1");
    });
}