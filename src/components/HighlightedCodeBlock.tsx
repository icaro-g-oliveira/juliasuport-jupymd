import * as React from "react";
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { julia } from "@plutojl/lang-julia"; // Importação via Pluto.jl engine
import { syntaxHighlighting } from "@codemirror/language";
import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Cria um estilo vazio para não haver conflito de saturação/cores
// Define as tags que o CodeMirror deve transformar em classes CSS
const obsidianThemeStyle = HighlightStyle.define([
    { tag: t.keyword, class: "cm-keyword" },
    { tag: t.operator, class: "cm-operator" },
    { tag: t.string, class: "cm-string" },
    { tag: t.comment, class: "cm-comment" },
    { tag: t.number, class: "cm-number" },
    { tag: t.variableName, class: "cm-variableName" },
    { tag: t.function(t.variableName), class: "cm-function" },
    { tag: t.macroName, class: "cm-macroName" }, // Importante para @macros
    { tag: t.punctuation, class: "cm-punctuation" },
    { tag: t.bool, class: "cm-bool" },
    { tag: t.className, class: "cm-className" }
]);

interface HighlightedCodeBlockProps {
    code: string;
    language: "python" | "julia" | string;
}

export const HighlightedCodeBlock: React.FC<HighlightedCodeBlockProps> = ({ code, language }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        // Seletor dinâmico de extensão de linguagem
        const langExtension = language === "julia" ? julia() : python();

        const state = EditorState.create({
            doc: code,
            extensions: [
                langExtension,
                syntaxHighlighting(obsidianThemeStyle), // Força o CM6 a usar apenas as classes CSS
                EditorView.editable.of(false),
                EditorState.readOnly.of(true),
                EditorView.theme({
                    "&": { height: "auto", backgroundColor: "transparent" },
                    "&.cm-focused": { outline: "none" }, // Remove borda de foco
                    ".cm-content": { 
                        fontFamily: "var(--font-monospace)",
                        padding: "16px 0" 
                    },
                    ".cm-line": { 
                        padding: "0 16px",
                        lineHeight: "1.6"
                    }
                })
            ],
        });

        // Limpeza de instância anterior
        if (viewRef.current) viewRef.current.destroy();

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => view.destroy();
    }, [code, language]);

    return <div ref={editorRef} className="obsidian-cm6-engine" />;
};