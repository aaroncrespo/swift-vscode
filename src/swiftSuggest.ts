'use strict';

import vscode = require('vscode');
import cp = require('child_process');
import { dirname, basename } from 'path';

import { TextDocument, Position } from 'vscode';

interface SwiftCompletionSuggestion {
    name: string;
	docBrief: string;
	sourcetext: string;
	typeName: string;
	descriptionKey: string;
	kind: string;
}

export class SwiftCompletionItemProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {             
		return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
			
			let lineText = document.lineAt(position.line).text;
			
			if (lineText.match(/^\s*\/\//)) {
				return resolve([]);
			}

			if ((lineText.substring(0, position.character).match(/\"/g) || []).length % 2 === 1) {
				return resolve([]);
			}

			let wordAtPosition = document.getWordRangeAtPosition(position);
			let currentWord = '';

			if (wordAtPosition && wordAtPosition.start.character < position.character) {
				let word = document.getText(wordAtPosition);
				currentWord = word.substr(0, position.character - wordAtPosition.start.character);
			}

			if (currentWord.match(/^\d+$/)) {
				return resolve([]);
			}

			let filename = document.fileName;
			let offset = document.offsetAt(position);

			let env = Object.assign({}, process.env, { maxBuffer: 1024 * 500 });
			// look forward to see if we we should complete...
			// todo config
			let p = cp.execFile('/usr/local/bin/sourcekitten', ['complete', '--file', filename, '--offset', '' + offset], { env }, (err, stdout, stderr) => {
				try {
					if (err && (<any>err).code === 'ENOENT') {
						vscode.window.showInformationMessage('The "sourcekitten" command is not available.');
					}
					if (err) return reject(err);
					let results = <[SwiftCompletionSuggestion]>JSON.parse(stdout.toString());
					let suggestions = [];
					for (let suggest of results) {
						let item = new vscode.CompletionItem(suggest.descriptionKey);
						item.detail 		= suggest.typeName;
						item.documentation 	= suggest.docBrief;
						let sourcetext 		= suggest.sourcetext;
						let isSnippet = sourcetext.match('<#T##');
						// def a better way to handle this
						if (isSnippet) {
							do {
								// usefull to capture this type hint we delete?
								sourcetext = sourcetext.replace('<#T##', '{{').replace('##\w*','').replace('#>', '}}');
								item.kind = vscode.CompletionItemKind.Snippet;
							} while (sourcetext.match('<#T##'))
						} else if (!isSnippet && suggest.kind.match('var\.instance')) {
							item.kind = vscode.CompletionItemKind.Property;
						} else if (!isSnippet && suggest.kind.match('method\.instance"')) {
							item.kind = vscode.CompletionItemKind.Method;
						} else if (!isSnippet && suggest.kind.match('operator') || suggest.kind.match('function.subscript')) {
							item.kind = vscode.CompletionItemKind.Function;
							//todo prefix...
						}

						item.insertText = sourcetext
						suggestions.push(item);
					};
					resolve(suggestions);
				} catch (e) {
					reject(e);  
				}
			});   
			p.stdin.end(document.getText());
		});
	};
};