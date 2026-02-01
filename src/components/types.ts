export type JupyMDPluginSettings = {
    juliaExecutable: string;
	autoSync: boolean;
	bidirectionalSync: boolean;
	pythonInterpreter: string;
	notebookEditorCommand: string;
	enableCodeBlocks: boolean;
}

export const DEFAULT_SETTINGS: JupyMDPluginSettings = {
	autoSync: true,
	bidirectionalSync: false,
	pythonInterpreter: "",
	notebookEditorCommand: "jupyter-lab",
	enableCodeBlocks: true,
	juliaExecutable: ""
};

export type CodeBlock = {
	code: string;
	cellIndex: number;
	language?: string;
}

export type PythonBlockProps = {
	code?: string;
	path?: string;
	index?: number;
	executor?: any;
	plugin?: any;
	language?: string;
}
