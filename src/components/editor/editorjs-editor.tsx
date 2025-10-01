"use client";

import { useEffect, useRef, useState } from "react";
import { EditorJSOutput } from "@/types/page";

interface EditorJSEditorProps {
  data?: EditorJSOutput;
  onChange?: (data: EditorJSOutput) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export function EditorJSEditor({ 
  data, 
  onChange, 
  placeholder = "Start writing your content...",
  readOnly = false,
  className = ""
}: EditorJSEditorProps) {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let editor: any = null;

    const initEditor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic imports to avoid SSR issues
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const List = (await import("@editorjs/list")).default;
        const Image = (await import("@editorjs/image")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Table = (await import("@editorjs/table")).default;
        const Code = (await import("@editorjs/code")).default;
        const Link = (await import("@editorjs/link")).default;
        const Raw = (await import("@editorjs/raw")).default;

        editor = new EditorJS({
          holder: editorRef.current,
          placeholder,
          readOnly,
          data: data || undefined,
          tools: {
            header: Header,
            paragraph: Paragraph,
            list: List,
            quote: Quote,
            image: Image,
            table: Table,
            code: Code,
            linkTool: Link,
            delimiter: Delimiter,
            raw: Raw
          },
          onChange: async (api: any) => {
            if (onChange && !readOnly) {
              try {
                const outputData = await api.saver.save();
                onChange(outputData);
              } catch (error) {
                console.error("Error saving editor data:", error);
              }
            }
          }
        });

        editorRef.current = editor;
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing editor:", error);
        setError("Failed to initialize editor");
        setIsLoading(false);
      }
    };

    initEditor();

    return () => {
      if (editor && editor.destroy) {
        editor.destroy();
      }
    };
  }, [data, onChange, placeholder, readOnly]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Failed to load editor</p>
      </div>
    );
  }

  return (
    <div className={`editor-container ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-32 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading editor...</span>
          </div>
        </div>
      )}
      <div 
        ref={editorRef} 
        className={`editor-js ${isLoading ? 'hidden' : ''}`}
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
