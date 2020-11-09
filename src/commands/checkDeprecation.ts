import * as vscode from 'vscode';
import * as fs from 'fs';
import * as rd from 'readline';
import {readContents} from './readLocalList';
export function highlightDeprecated(){
    const editor = vscode.window.activeTextEditor;
    if(editor){
        // const doc = editor.document;
        // const sel = editor.selection;
        // const word = doc.getText(sel);
        // console.log("word highlighted - "+word);
        readContents();
        let lineCount = editor.document.lineCount;
        for(let i=0;i<lineCount;i++){
            let text:string = editor.document.lineAt(i).text;
            console.log(text);
        }
        vscode.window.showInformationMessage('Hello World from PyDDetector!');
    }
    else{
        vscode.window.showInformationMessage("No current active editors");
    }
}