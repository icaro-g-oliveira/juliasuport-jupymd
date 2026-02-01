import { Plugin, TFile } from "obsidian";
import { JupyMDSettingTab } from "./components/Settings";
import { CodeExecutor } from "./components/CodeExecutor";
import { FileSync } from "./components/FileSync";
import { DEFAULT_SETTINGS, JupyMDPluginSettings } from "./components/types";
import { registerCommands } from "./commands";
import { createRoot } from "react-dom/client";
import { PythonCodeBlock } from "./components/CodeBlock";
import { getAbsolutePath } from "./utils/helpers";
import { getDefaultPythonPath } from "./utils/pythonPathUtils";

export default class JupyMDPlugin extends Plugin {
	settings: JupyMDPluginSettings;
	executor: CodeExecutor;
	fileSync: FileSync;
	currentNotePath: string | null = null;

	async onload() {
		await this.loadSettings();

		if (!this.settings.pythonInterpreter) {
			this.settings.pythonInterpreter = getDefaultPythonPath();
			await this.saveSettings();
		}

		this.executor = new CodeExecutor(this, this.app);		
		this.fileSync = new FileSync(this.app, this.settings.pythonInterpreter, this.settings);

		registerCommands(this);

		this.addSettingTab(new JupyMDSettingTab(this.app, this));

		this.registerEvent( // TODO: add option manually sync and disable auto sync
			this.app.vault.on("modify", async (file: TFile) => {
				if (this.settings.autoSync) {
					await this.fileSync.handleSync(file);
				}
			})
		);

		const supportedLanguages: Array<"python" | "julia"> = ["python", "julia"];

		if (this.settings.enableCodeBlocks) {
			supportedLanguages.forEach(async (lang) => {
				await this.registerMarkdownCodeBlockProcessor(
					lang,
					async (source, el, ctx) => {
						el.empty();
						const reactRoot = document.createElement("div");
						el.appendChild(reactRoot);

						const activeFile = this.app.vault.getFileByPath(ctx.sourcePath);
						const sectionInfo = ctx.getSectionInfo(el);

						if (activeFile && sectionInfo) {
							const filePath = getAbsolutePath(activeFile);
							const fileContent = await this.app.vault.read(activeFile);
							
							// Cálculo do índice baseado em blocos de código mistos
							const lines = fileContent.split("\n");
							let blockIndex = 0;
							
							for (let i = 0; i < lines.length; i++) {
								const line = lines[i].trim();
								// Detecta qualquer abertura de bloco para manter paridade com o .ipynb
								if (line.startsWith("```python") || line.startsWith("```julia")) {
									if (i < sectionInfo.lineStart) {
										blockIndex++;
									} else if (i === sectionInfo.lineStart) {
										break;
									}
								}
							}

							createRoot(reactRoot).render(
								<PythonCodeBlock
									code={source}
									path={filePath}
									index={blockIndex}
									executor={this.executor}
									plugin={this}
									language={lang} // Prop passiva para o realce e execução
								/>
							);
						}
					}
				);
			});
		}
	}

	async onunload() {
		this.executor.cleanup();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
