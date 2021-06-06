import * as vscode from 'vscode';
import * as fs from 'fs';
// import {PythonShell} from 'python-shell';

let list:string[] = []; 
let kwd:string[] = [];
let package1:string = "";
let msg:string[] = [];
// eslint-disable-next-line @typescript-eslint/naming-convention
let Keyword_list:string[] = ["seaborn","sklearn","matplotlib","deprecate"];

function getDeprecatedAPIcall(currentLine:string, apiElements:string[]){
	apiElements.forEach(element => {
		let words:string[] = currentLine.split("=");
		let elements:string[] = element.split(":");
		let str:string = elements[0].replace("()","");
		if(words[words.length - 1].indexOf(str)!==-1 && str!==""){
			if(elements.length!==0){
				let flag:number = 1;
				Keyword_list.forEach(element1 => {
					if(elements[0].indexOf(element1)!==-1){
						flag = 0;
					}
				});
				if(flag!==0){
					const str1 = elements[0].replace("()","");
					if(!kwd.includes(str1)){
						kwd.push(str1);
						let msg1:string = elements[1];
						if(msg1.indexOf("arg")!==-1){
							msg1 = `${elements[0]} : arguments has been deprecated"`;
						}
						else{
							msg1 = `${elements[0]} has been deprecated. `;
						}
						for(let i=1;i<elements.length;i++){
							msg1 +=elements[i]+" ";
						}
						if(!msg.includes(msg1)){
							msg.push(msg1);
						}
					}
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
	const packages = ["sklearn","pandas","numpy","scipy","seaborn","matplotlib"];
    if(currentLine.indexOf("import")!==-1){
		for(let i=0;i<packages.length;i++){
			if(currentLine.indexOf(packages[i])!==-1){
                let path = require('path');
                let fp1:string = path.join(__dirname, "commands/pyScripts/output/"+packages[i]+"_deprecated_api_elements.txt");
				util_readContents(fp1);
				package1 = packages[i];
			}
		}
	}
}
function highlightDeprecated(){
    const editor = vscode.window.activeTextEditor;
	let strArr:string[] = [];
	// vscode.window.showInformationMessage('API Scanner is now active!');
    if(editor){
        let lineCount = editor.document.lineCount;
        for(let i=0;i<lineCount;i++){
            let text:string = editor.document.lineAt(i).text;
			readContents(text);
			getDeprecatedAPIcall(text,list);
			// console.log("here1 - ",kwd,msg);
		}
        return strArr;
    }
    else{
        vscode.window.showInformationMessage("No current active editors");
    }
    return strArr;
}
export function activate(context: vscode.ExtensionContext) {
	list = [];
	console.log('Congratulations, your extension "APIScanner" is now active!');
	// eslint-disable-next-line @typescript-eslint/naming-convention
	// var PythonShell = require('python-shell');
	// PythonShell.run('test.py', null, function (err: any) {
	// 	if (err) {throw err;}
	// 	console.log('finished');
	//   }); 
	let timeout: NodeJS.Timer | undefined = undefined;

	const deprecationDecorationType = vscode.window.createTextEditorDecorationType({

		cursor:'crosshair',
		backgroundColor:"orange",
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
		function getIndicesOf(searchStr: string, str: string, caseSensitive: any) {
			var searchStrLen = searchStr.length;
			if (searchStrLen === 0) {
				return [];
			}
			var startIndex = 0, index, indices = [];
			if (!caseSensitive) {
				str = str.toLowerCase();
				searchStr = searchStr.toLowerCase();
			}
			while ((index = str.indexOf(searchStr, startIndex)) > -1) {
				indices.push(index);
				startIndex = index + searchStrLen;
			}
			return indices;
		}
		const text = activeEditor.document.getText();
		const deprecatedCall: vscode.DecorationOptions[] = [];
		for(let i=0;i<kwd.length;i++){
			let ind:number[] = [];
			ind = getIndicesOf(kwd[i],text,1);
			if(ind.length!==0){
				for(let j=0;j<ind.length;j++){
					if(activeEditor){
						const startPos = activeEditor.document.positionAt(ind[j]);
						const endPos = activeEditor.document.positionAt(ind[j] + kwd[i].length);
						const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: msg[i] };
						console.log("here - ",kwd,msg);
						deprecatedCall.push(decoration);
					}
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