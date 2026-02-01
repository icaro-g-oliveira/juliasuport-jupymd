import * as React from "react";
import {useEffect, useRef} from "react";
import {highlightElement} from "prismjs";
import "prismjs/components/prism-python";

interface HighlightedCodeBlockProps {
    code: string;
    language: string | "python" | "julia";
}

export const HighlightedCodeBlock: React.FC<HighlightedCodeBlockProps> = ({
    code, 
    language = "python" 
}) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            highlightElement(codeRef.current);
        }
    }, [code, language]);

    // O seletor de classe deve ser dinâmico para o PrismJS aplicar a gramática correta
    const langClass = `language-${language}`;

    return (
        <pre className={langClass}>
            <code ref={codeRef} className={langClass}>
                {code}
            </code>
        </pre>
    );
};