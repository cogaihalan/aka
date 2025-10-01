"use client";

import React from "react";
import { EditorJSOutput } from "@/types/page";

interface EditorJSRendererProps {
  data: EditorJSOutput;
  className?: string;
}

export function EditorJSRenderer({ data, className = "" }: EditorJSRendererProps) {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className={`text-muted-foreground ${className}`}>No content available</div>;
  }

  const renderBlock = (block: any, index: number) => {
    const { type, data: blockData } = block;

    switch (type) {
      case "header":
        const level = blockData.level || 2;
        const headerClass = "font-bold mb-4 mt-6 first:mt-0";
        switch (level) {
          case 1:
            return <h1 key={index} className={headerClass}>{blockData.text}</h1>;
          case 2:
            return <h2 key={index} className={headerClass}>{blockData.text}</h2>;
          case 3:
            return <h3 key={index} className={headerClass}>{blockData.text}</h3>;
          case 4:
            return <h4 key={index} className={headerClass}>{blockData.text}</h4>;
          case 5:
            return <h5 key={index} className={headerClass}>{blockData.text}</h5>;
          case 6:
            return <h6 key={index} className={headerClass}>{blockData.text}</h6>;
          default:
            return <h2 key={index} className={headerClass}>{blockData.text}</h2>;
        }

      case "paragraph":
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {blockData.text}
          </p>
        );

      case "list":
        const ListTag = blockData.style === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={index} className={`mb-4 ${blockData.style === "ordered" ? "list-decimal" : "list-disc"} list-inside`}>
            {blockData.items.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="mb-1">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic">
            <p className="mb-2">{blockData.text}</p>
            {blockData.caption && (
              <cite className="text-sm text-gray-600">— {blockData.caption}</cite>
            )}
          </blockquote>
        );

      case "image":
        return (
          <div key={index} className="mb-4">
            <img
              src={blockData.file?.url || blockData.url}
              alt={blockData.caption || ""}
              className="max-w-full h-auto rounded-lg"
            />
            {blockData.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">{blockData.caption}</p>
            )}
          </div>
        );

      case "table":
        return (
          <div key={index} className="mb-4 overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <tbody>
                {blockData.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "code":
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm">{blockData.code}</code>
          </pre>
        );

      case "delimiter":
        return <hr key={index} className="my-8 border-gray-300" />;

      case "raw":
        return (
          <div 
            key={index} 
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: blockData.html }}
          />
        );

      case "linkTool":
        return (
          <div key={index} className="mb-4">
            <a
              href={blockData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {blockData.meta?.title || blockData.link}
            </a>
            {blockData.meta?.description && (
              <p className="text-sm text-gray-600 mt-1">{blockData.meta.description}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Unsupported block type: {type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
