'use strict';

import vscode = require('vscode');
import cp = require('child_process');
import { dirname, basename } from 'path';
import { TextDocument, Position } from 'vscode';

import { SwiftType, completionKindForSwiftType  } from './swiftSourceTypes';

interface SwiftCompletionSuggestion {
	/** 
	 * @type {string}
	 */
	name: string,
	/** 
	 * @type {string}
	 */
	descriptionKey: string,
	/** 
	 * @type {string}
	 */
	sourcetext: string,
	/** 
	 * @type {SwiftType}
	 */
	kind: SwiftType,
	/** 
	 * @type {string}
	 */
	typeName: string,
	/** 
	 * @type {string}
	 */
	moduleName: string,
	/** 
	 * @type {string}
	 */
	associatedUSRs: string,
	/** 
	 * @type {string}
	 */
	context: string,
	/** 
	 * @type {string}
	 */
	docBrief: string,
};

function swiftSuggestionToCompletionItem(suggestion: SwiftCompletionSuggestion): vscode.CompletionItem {
	let item = new vscode.CompletionItem(suggestion.descriptionKey);
	item.detail = suggestion.typeName;
	item.documentation = suggestion.docBrief;
	item.insertText = createSnippet(suggestion);
	item.kind = completionKindForSwiftType(suggestion.kind);
	item.filterText = item.insertText;

 	if (suggestion.sourcetext.length != item.insertText.length) {
		item.kind |= vscode.CompletionItemKind.Snippet;
	}
	return item;
};

function createSnippet(suggestion: SwiftCompletionSuggestion): string {
	let cursorIndex = 1
	/**
	 * @param {any} _
	 * @param {any} group
	 * @returns
	 */
	const replacer = suggestion.sourcetext.replace(/<#T##(.+?)#>/g, (_, group) => {
		return `\{{${cursorIndex++}:${group.split('##')[0]}}}`;
	});
	return replacer.replace('<#code#>', `\{{${cursorIndex++}}}`);
};

/**
 *
 * 	we can complete type constrants <{{}}>
 *	we can complete functions and parameters-ish foo(bar:{{}})
 *	TODO: complete initializers Array<String>({{}}) or String()
 *	TODO: better completion outside of clear boundaries: foo: T defined in scope should complete on fo{{}}
 *	TODO: better expanding of closure snippets 
 * 
 * @export
 * @class SwiftCompletionItemProvider
 * @implements {vscode.CompletionItemProvider}
 */
export class SwiftCompletionItemProvider implements vscode.CompletionItemProvider {
	/**
	 * 
	 * 
	 * @param {vscode.TextDocument} document
	 * @param {vscode.Position} position
	 * @param {vscode.CancellationToken} token
	 * @returns {Thenable<vscode.CompletionItem[]>}
	 */
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
		return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
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
					}
					resolve(suggestions);
				} catch (e) {
					reject(e);
				}
			});
			p.stdin.end(document.getText());
		});
	};
};
