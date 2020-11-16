import * as vscode from 'vscode';
import * as fs from 'fs';
import * as rd from 'readline';
import {readContents} from './readLocalList';
export function highlightDeprecated(){
    const editor = vscode.window.activeTextEditor;
    let strArr:string[] = [];
    if(editor){
        // const doc = editor.document;
        // const sel = editor.selection;
        // const word = doc.getText(sel);
        // console.log("word highlighted - "+word);
        let lineCount = editor.document.lineCount;
        for(let i=0;i<lineCount;i++){
            let text:string = editor.document.lineAt(i).text;
            // console.log(text);
            let str = readContents(text);
            // console.log("str - ",str);
            // if(str!==undefined && typeof(str)==='string'){
            //     console.log(str);
            //     strArr.push("$");
            // }
        }
        vscode.window.showInformationMessage('Hello World from PyDDetector!');
        return strArr;
    }
    else{
        vscode.window.showInformationMessage("No current active editors");
    }
    return strArr;
}