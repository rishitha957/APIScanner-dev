import { downloadAndUnzipVSCode } from "vscode-test";

import * as vscode from 'vscode';
export function readContents(){
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let localApiCalls:string = "";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let localApiCallsDescription:string = "";
    let filepath:string = "D:/RISHA/vscode_extension/pyddetectorts/src/commands/deprecated_list.txt";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let descriptionFilepath:string = "D:/RISHA/vscode_extension/pyddetectorts/src/commands/deprecated_list_description.txt";
    let doc = vscode.workspace.openTextDocument(vscode.Uri.file(filepath));
    doc.then(document => {
        localApiCalls += document.getText();
        console.log("br1");
    });
    let doc1 = vscode.workspace.openTextDocument(vscode.Uri.file(descriptionFilepath));
    doc.then(document => {
        localApiCallsDescription += document.getText();
        console.log("br1");
    });
    console.log(localApiCalls);
    var localApiCallsStringArr = localApiCalls.split("\n");
    console.log(localApiCallsStringArr);
    console.log(localApiCallsDescription);
    var localApiCallsDescriptionStringArr = localApiCalls.split("\n");
    console.log(localApiCallsDescriptionStringArr);
}