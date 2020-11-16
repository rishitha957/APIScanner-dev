// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {highlightDeprecated} from './commands/checkDeprecation';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "APIScanner" is now active!');

	let timeout: NodeJS.Timer | undefined = undefined;

	// create a decorator type that we use to decorate small numbers
	const deprecationDecorationType = vscode.window.createTextEditorDecorationType({
		// borderWidth: '1px',
		cursor:'crosshair',
		// borderStyle: 'solid',
		backgroundColor:"purple",
		overviewRulerColor: 'blue',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		// backgroundColor: new vscode.ThemeColor('gitlens.trailingLineBackgroundColor'),
		// color: new vscode.ThemeColor('gitlens.trailingLineForegroundColor'),
		before: {
			margin: "0 0 0 3em",
			backgroundColor: new vscode.ThemeColor('gitlens.trailingLineBackgroundColor'),
			color: new vscode.ThemeColor('gitlens.trailingLineForegroundColor'),
			// contentText: String.pad(message.replace(/ /g, GlyphChars.Space), 1, 1),
			// contentText: "=============hello world===========",
			fontWeight: "normal",
			fontStyle: "normal"
			// Pull the decoration out of the document flow if we want to be scrollable
			// textDecoration: `none;${scrollable ? "" : " position: absolute;"}`
		  },
		textDecoration: 'undeline wavy lightblue',
		gutterIconPath: './icon.png',
		light: {
			// this color will be used in light color themes
			borderColor: 'darkblue'
		},
		dark: {
			// this color will be used in dark color themes
			borderColor: 'lightblue'
		}
	});

	// create a decorator type that we use to decorate large numbers

	let activeEditor = vscode.window.activeTextEditor;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /\d+/g;
		const text = activeEditor.document.getText();
		const deprecatedCall: vscode.DecorationOptions[] = [];
		// let match;
		// while ((match = regEx.exec(text))) {
		// 	const startPos = activeEditor.document.positionAt(match.index);
		// 	const endPos = activeEditor.document.positionAt(match.index + match[0].length);
		// 	const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
		// 	if (match[0]) {
		// 		deprecatedCall.push(decoration);
		// 	}
		// }
		let str:string = "load_svmlight_file";
		let ind:number = text.indexOf(str);
		if(ind!==-1){
			const startPos = activeEditor.document.positionAt(ind);
			const endPos = activeEditor.document.positionAt(ind + str.length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Deprecated Positional Arguments: sklearn 0.23 -  **' + str + '**' };
			deprecatedCall.push(decoration);

		} 
		activeEditor.setDecorations(deprecationDecorationType, deprecatedCall);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
		highlightDeprecated();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
			highlightDeprecated();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
			highlightDeprecated();
		}
	}, null, context.subscriptions);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('APIScanner.init', highlightDeprecated);
	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
