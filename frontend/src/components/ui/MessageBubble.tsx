import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "lucide-react";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const MessageBubble = ({ content, sender }: { content: string; sender: "user" | "bot" }) => {
  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;

  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: "code", language: match[1] || "text", code: match[2] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} my-2`}>
      <div className={`p-3 rounded-lg max-w-[85%] ${sender === "user" ? "bg-primary text-white" : "bg-muted text-black"}`}>
        {segments.map((seg, idx) =>
          seg.type === "code" ? (
            <div key={idx} className="relative">
              <SyntaxHighlighter language={seg.language} style={vscDarkPlus} customStyle={{ borderRadius: 6, padding: 12 }}>
                {seg.code.trim()}
              </SyntaxHighlighter>
              <button
                className="absolute top-2 right-2 text-white bg-black/50 px-2 py-1 rounded text-xs"
                onClick={() => copyToClipboard(seg.code.trim())}
              >
                <Clipboard size={14} />
              </button>
            </div>
          ) : (
            <p key={idx} className="mb-2 whitespace-pre-line">{seg.content.trim()}</p>
          )
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
