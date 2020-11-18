import * as vscode from 'vscode';
import * as fs from 'fs';

let list:string[] = []; 
let kwd:string[] = [];
let package1:string = "";
let msg:string[] = [];
// eslint-disable-next-line @typescript-eslint/naming-convention
let deprecated_list:string[] = [];

function getDeprecatedAPIcall(currentLine:string, apiElements:string[]){
	apiElements.forEach(element => {
		let words:string[] = currentLine.split("=");
		let elements:string[] = element.split(":");
		let str:string = elements[0].replace("()","");
		if(words[words.length - 1].indexOf(str)!==-1 && str!==""){
			if(elements.length!==0){
				const str1 = elements[0].replace("()","");
				if(!kwd.includes(str1)){
					kwd.push(str1);
				}
				let msg1:string = `${elements[0]} has been deprecated. `;
				for(let i=1;i<elements.length;i++){
					msg1 +=elements[i]+" ";
				}
				if(!msg.includes(msg1)){
					msg.push(msg1);
				}
			}
		}
	});
}

function readContents(currentLine:string){
	// eslint-disable-next-line @typescript-eslint/naming-convention
	function util_readContents(fp1:string){
		let str1 = fs.readFileSync(fp1,'utf8');
		let list1:string[] = str1.split("\n");
		// console.log(list1);
		list1.forEach(element => {
			if(!list.includes(element)){
				list.push(element);
			}
		});
	}
    if(currentLine.indexOf("import")!==-1){
        // console.log(currentLine);
        if(currentLine.indexOf("sklearn")!==-1){
            let path = require('path');
			let fp1:string = path.join(__dirname, "commands/pyScripts/output/sklearn_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "sklearn";
		}
        if(currentLine.indexOf("seaborn")!==-1){
            // console.log("here2");
            let path = require('path');
            let fp1:string = path.join(__dirname, "commands/pyScripts/output/seaborn_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "seaborn";
        }
        if(currentLine.indexOf("numpy")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "commands/pyScripts/output/numpy_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "numpy";
        }
        if(currentLine.indexOf("matplotlib")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "commands/pyScripts/output/matplotlib_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "matplotlib";
        }
        if(currentLine.indexOf("pandas")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "commands/pyScripts/output/pandas_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "pandas";
        }
        if(currentLine.indexOf("scipy")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "commands/pyScripts/output/scipy_deprecated_api_elements.txt");
			util_readContents(fp1);
			package1 = "scipy";
        }
    }
}
function highlightDeprecated(){
    const editor = vscode.window.activeTextEditor;
    let strArr:string[] = [];
    if(editor){
        let lineCount = editor.document.lineCount;
        for(let i=0;i<lineCount;i++){
            let text:string = editor.document.lineAt(i).text;
			readContents(text);
			getDeprecatedAPIcall(text,list);
			console.log("here1 - ",kwd,msg);
		}
        vscode.window.showInformationMessage('API Scanner is now active!');
        return strArr;
    }
    else{
        vscode.window.showInformationMessage("No current active editors");
    }
    return strArr;
}
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "APIScanner" is now active!');

	let timeout: NodeJS.Timer | undefined = undefined;

	const deprecationDecorationType = vscode.window.createTextEditorDecorationType({

		cursor:'crosshair',
		backgroundColor:"purple",
		overviewRulerColor: 'blue',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		before: {
			margin: "0 0 0 3em",
			backgroundColor: new vscode.ThemeColor('gitlens.trailingLineBackgroundColor'),
			color: new vscode.ThemeColor('gitlens.trailingLineForegroundColor'),
			fontWeight: "normal",
			fontStyle: "normal"
		  },
		textDecoration: 'undeline wavy red',
		gutterIconPath: './icon.png',
		light: {
			borderColor: 'darkblue'
		},
		dark: {
			borderColor: 'lightblue'
		}
	});
	var activeEditor = vscode.window.activeTextEditor;
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const text = activeEditor.document.getText();
		const deprecatedCall: vscode.DecorationOptions[] = [];
		let ind:number = -1;
		for(let i=0;i<kwd.length;i++){
			ind = text.indexOf(kwd[i]);
			if(ind!==-1){
				if(activeEditor){
					const startPos = activeEditor.document.positionAt(ind);
					const endPos = activeEditor.document.positionAt(ind + kwd[i].length);
					const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: msg[i] };
					deprecatedCall.push(decoration);
				}
			} 
			if(activeEditor){
				activeEditor.setDecorations(deprecationDecorationType, deprecatedCall);
			}
		}
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	if (activeEditor) {
		highlightDeprecated();
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			highlightDeprecated();
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			highlightDeprecated();
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);
}
export function deactivate() {}