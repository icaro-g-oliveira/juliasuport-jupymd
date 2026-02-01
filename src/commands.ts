import JupyMDPlugin from "./main";

export function registerCommands(plugin: JupyMDPlugin) {
	const { fileSync } = plugin;
	const { executor } = plugin;

	plugin.addCommand({
		id: "create-jupyter-notebook",
		name: "Create Jupyter notebook from note",
		callback: () => fileSync.createNotebook(),
	});

	plugin.addCommand({
		id: "create-note-from-jupyter-notebook",
		name: "Create note from Jupyter notebook",
		callback: () => fileSync.convertNotebookToNote(),
	});

	plugin.addCommand({
		id: "open-jupyter-notebook-editor",
		name: "Open Jupyter notebook in editor",
		callback: () => fileSync.openNotebookInEditor(plugin.settings.notebookEditorCommand),
	});

	plugin.addCommand({
        id: "restart-python-kernel",
        name: "Restart Python Kernel",
        callback: () => {
            plugin.executor.restartKernel("python");
        },
    });

    plugin.addCommand({
        id: "restart-julia-kernel",
        name: "Restart Julia Kernel",
        callback: () => {
            plugin.executor.restartKernel("julia");
        },
    });

    plugin.addCommand({
        id: "sync-notebook",
        name: "Force Sync with .ipynb",
        checkCallback: (checking: boolean) => {
            const activeFile = plugin.app.workspace.getActiveFile();
            if (activeFile && activeFile.extension === "md") {
                if (!checking) {
                    plugin.fileSync.handleSync(activeFile);
                }
                return true;
            }
            return false;
        },
    });

	plugin.addCommand({
		id: "force-sync",
		name: "Sync files",
		callback: () => fileSync.handleSync(undefined, true),
	});
}
