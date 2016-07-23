'use strict';

import vscode = require('vscode');
import cp = require('child_process');
import { dirname, basename } from 'path';
import { TextDocument, Position } from 'vscode';

import { SwiftType, completionKindForSwiftType  } from './swiftSourceTypes';

interface SwiftCompletionSuggestion {
	name: string,
	descriptionKey: string,
	sourcetext: string,
	kind: SwiftType,
	typeName: string,
	moduleName: string,
	associatedUSRs: string,
	context: string,
	docBrief: string,
};

function swiftSuggestionToCompletionItem(suggestion: SwiftCompletionSuggestion): vscode.CompletionItem {
	let item = new vscode.CompletionItem(suggestion.descriptionKey);
	item.detail = suggestion.typeName;
	item.documentation = suggestion.docBrief;
	let sourcetext = createSnippet(suggestion);
	if (sourcetext.length != suggestion.sourcetext.length) {
		// is this really allowed?
		item.kind = vscode.CompletionItemKind.Snippet | completionKindForSwiftType(suggestion.kind);
	} else {
		item.kind = completionKindForSwiftType(suggestion.kind);
	}
	item.insertText = sourcetext;
	return item;
};

function createSnippet(suggestion: SwiftCompletionSuggestion): string {
	let cursorIndex = 1
	const replacer = suggestion.sourcetext.replace(/<#T##(.+?)#>/g, (_, group) => {
		return `\{{${cursorIndex++}:${group.split('##')[0]}}}`;
	});
	return replacer.replace('<#code#>', `\{{${cursorIndex++}}}`);
};

// we can complete type constrants <{{}}> 
// we can complete functions and parameters-ish foo(bar:{{}})
// todo complete initializers Array<String>({{}}) or String()
// todo better completion outside of clear boundaries: foo: T defined in scope should complete on fo{{}}
// todo better expanding of closure snippets

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
			// config/exec
			let env = Object.assign({}, process.env, { maxBuffer: 1024 * 512 });
			let args = ['complete', '--file', filename, '--offset', '' + offset]
			let completerBin = '/usr/local/bin/sourcekitten'

			let p = cp.execFile(completerBin, args, { env }, (err, stdout, stderr) => {
				try {
					if (err && (<any>err).code === 'ENOENT') {
						vscode.window.showInformationMessage('The "sourcekitten" command is not available.');
					}
					if (err) return reject(err);
					let results = <[SwiftCompletionSuggestion]>JSON.parse(stdout.toString());
					let suggestions = [];
					for (let suggest of results) {
						suggestions.push(swiftSuggestionToCompletionItem(suggest));
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
