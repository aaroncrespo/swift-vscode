import vscode = require('vscode');

export enum Keyword {
    Keyword, 'source.lang.swift.keyword',
};
export enum Decl {
    Associatedtype, 'source.lang.swift.decl.associatedtype',
    Class, 'source.lang.swift.decl.class',
    Enum, 'source.lang.swift.decl.enum',
    Enumelement, 'source.lang.swift.decl.enumelement',
    GenericTypeParam, 'source.lang.swift.decl.generic_type_param',
    Protocol, 'source.lang.swift.decl.protocol',
    Struct, 'source.lang.swift.decl.struct',
    Typealias, 'source.lang.swift.decl.typealias',
};
export enum DeclExtension {
    Class, 'source.lang.swift.decl.extension.class',
};
export enum DeclFunction {
    Constructor, 'source.lang.swift.decl.function.constructor',
    Free, 'source.lang.swift.decl.function.free',
    Subscript, 'source.lang.swift.decl.function.subscript',
};
export enum DeclFunctionOperator {
    Infix, 'source.lang.swift.decl.function.operator.infix',
};
export enum DeclFunctionAccessor {
    Getter, 'source.lang.swift.decl.function.accessor.getter',
    Setter, 'source.lang.swift.decl.function.accessor.setter',
};
export enum DeclFunctionMethod {
    Class, 'source.lang.swift.decl.function.method.class',
    Instance, 'source.lang.swift.decl.function.method.instance',
    Static, 'source.lang.swift.decl.function.method.static',
};
export enum DeclVar {
    Global, 'source.lang.swift.decl.var.global',
    Instance, 'source.lang.swift.decl.var.instance',
    Local, 'source.lang.swift.decl.var.local',
};
export enum Ref {
    Associatedtype, 'source.lang.swift.ref.associatedtype',
    Class, 'source.lang.swift.ref.class',
    Enum, 'source.lang.swift.ref.enum',
    Enumelement, 'source.lang.swift.ref.enumelement',
    GenericTypeParam, 'source.lang.swift.ref.generic_type_param',
    Protocol, 'source.lang.swift.ref.protocol',
    Struct, 'source.lang.swift.ref.struct',
    Typealias, 'source.lang.swift.ref.typealias',
};
export enum RefFunction {
    Constructor, 'source.lang.swift.ref.function.constructor',
    Free, 'source.lang.swift.ref.function.free',
    Subscript, 'source.lang.swift.ref.function.subscript',
};
export enum RefFunctionMethod {
    Class, 'source.lang.swift.ref.function.method.class',
    Instance, 'source.lang.swift.ref.function.method.instance',
};
export enum RefFunctionOperator {
    Infix, 'source.lang.swift.ref.function.operator.infix'
};
export enum RefVar {
    Global, 'source.lang.swift.ref.var.global',
    Instance, 'source.lang.swift.ref.var.instance',
    Local, 'source.lang.swift.ref.var.local',
};
export enum Syntaxtype {
    Argument, 'source.lang.swift.syntaxtype.argument',
    Comment, 'source.lang.swift.syntaxtype.comment',
    Identifier, 'source.lang.swift.syntaxtype.identifier',
    Keyword, 'source.lang.swift.syntaxtype.keyword',
    Number, 'source.lang.swift.syntaxtype.number',
    Parameter, 'source.lang.swift.syntaxtype.parameter',
};
export enum SyntaxtypeAttribute {
    Builtin, 'source.lang.swift.syntaxtype.attribute.builtin',
};

export type SwiftType =
    Keyword |
    Decl |
    DeclExtension |
    DeclFunction |
    DeclFunctionOperator |
    DeclFunctionAccessor |
    DeclFunctionMethod |
    DeclVar |
    Ref |
    RefFunction |
    RefFunctionMethod |
    RefFunctionOperator |
    RefVar |
    Syntaxtype |
    SyntaxtypeAttribute;

export function completionKindForSwiftType(swiftType: SwiftType): vscode.CompletionItemKind {
    switch (swiftType) {
        case Keyword.Keyword:
            return vscode.CompletionItemKind.Keyword;
        case Decl.Associatedtype:
            return vscode.CompletionItemKind.Class;
        case Decl.Class:
            return vscode.CompletionItemKind.Class;
        case Decl.Enum:
            return vscode.CompletionItemKind.Enum;
        case Decl.Enumelement:
            return vscode.CompletionItemKind.Enum;
        case Decl.GenericTypeParam:
            return vscode.CompletionItemKind.Interface;
        case Decl.Protocol:
            return vscode.CompletionItemKind.Interface;
        case Decl.Struct:
            return vscode.CompletionItemKind.Class;
        case Decl.Typealias:
            return vscode.CompletionItemKind.Interface;
        case DeclExtension.Class:
            return vscode.CompletionItemKind.Class;
        case DeclFunction.Constructor:
            return vscode.CompletionItemKind.Constructor;
        case DeclFunction.Free:
            return vscode.CompletionItemKind.Function;
        case DeclFunction.Subscript:
            return vscode.CompletionItemKind.Function;
        case DeclFunctionOperator.Infix:
            return vscode.CompletionItemKind.Function;
        case DeclFunctionAccessor.Getter:
            return vscode.CompletionItemKind.Field;
        case DeclFunctionAccessor.Setter:
            return vscode.CompletionItemKind.Field;
        case DeclFunctionMethod.Class:
            return vscode.CompletionItemKind.Method;
        case DeclFunctionMethod.Instance:
            return vscode.CompletionItemKind.Reference;
        case DeclFunctionMethod.Static:
            return vscode.CompletionItemKind.Method;
        case DeclVar.Global:
            return vscode.CompletionItemKind.Reference;
        case DeclVar.Instance:
            return vscode.CompletionItemKind.Reference;
        case DeclVar.Local:
            return vscode.CompletionItemKind.Value;
        case Ref.Associatedtype:
            return vscode.CompletionItemKind.Interface;
        case Ref.Class:
            return vscode.CompletionItemKind.Class;
        case Ref.Enum:
            return vscode.CompletionItemKind.Enum;
        case Ref.Enumelement:
            return vscode.CompletionItemKind.Enum;
        case RefFunction.Constructor:
            return vscode.CompletionItemKind.Constructor;
        case RefFunction.Free:
            return vscode.CompletionItemKind.Function;
        case RefFunction.Subscript:
            return vscode.CompletionItemKind.Function;
        case RefFunctionMethod.Class:
            return vscode.CompletionItemKind.Class;
        case RefFunctionMethod.Instance:
            return vscode.CompletionItemKind.Reference;
        case RefFunctionOperator.Infix:
            return vscode.CompletionItemKind.Function;
        case Ref.GenericTypeParam:
            return vscode.CompletionItemKind.Interface;
        case Ref.Protocol:
            return vscode.CompletionItemKind.Interface;
        case Ref.Struct:
            return vscode.CompletionItemKind.Class;
        case Ref.Typealias:
            return vscode.CompletionItemKind.Interface;
        case RefVar.Global:
            return vscode.CompletionItemKind.Reference;
        case RefVar.Instance:
            return vscode.CompletionItemKind.Reference;
        case RefVar.Local:
            return vscode.CompletionItemKind.Value;
        case Syntaxtype.Argument:
            return vscode.CompletionItemKind.Value;
        case Syntaxtype.Comment:
            return vscode.CompletionItemKind.Text;
        case Syntaxtype.Identifier:
            return vscode.CompletionItemKind.Reference;
        case Syntaxtype.Keyword:
            return vscode.CompletionItemKind.Keyword;
        case Syntaxtype.Number:
            return vscode.CompletionItemKind.Unit;
        case Syntaxtype.Parameter:
            return vscode.CompletionItemKind.Value;
        case SyntaxtypeAttribute.Builtin:
            return vscode.CompletionItemKind.Field;
    };
    return vscode.CompletionItemKind.Variable;
};