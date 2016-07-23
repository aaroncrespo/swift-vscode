'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SWIFT_MODE } from './swiftMode';
import { SwiftCompletionItemProvider } from './swiftSuggest';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(SWIFT_MODE, new SwiftCompletionItemProvider(), '.', '\"'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}