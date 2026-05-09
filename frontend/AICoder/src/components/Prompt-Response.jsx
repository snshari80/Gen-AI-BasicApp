import { useState, useEffect, useRef } from "react";

const t = {
  bg: "#1a1a2e",
  bgHover: "#22223a",
  bgCode: "#13131f",
  border: "#2e2e4a",
  accent: "#6366f1",
  accentHover: "#4f46e5",
  text: "#e8e8f0",
  muted: "#8888aa",
  hint: "#55556a",
  success: "#34d399",
  btnBg: "#22223a",
};

function renderMarkdown(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `CODE_BLOCK:${lang}:${btoa(code.trim())}`)
    .split("\n\n")
    .map((para) => {
      if (para.startsWith("CODE_BLOCK:")) {
        const [, lang, encoded] = para.split(":");
        const code = atob(encoded);
        return { type: "code", lang, code };
      }
      return {
        type: "text",
        html: para
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/`([^`]+)`/g, `<code class="inline-code">$1</code>`)
          .replace(/\n/g, "<br>"),
      };
    });
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: t.bgCode, border: `1px solid ${t.border}`, borderRadius: 10, margin: "10px 0", overflow: "hidden" }}>
      {lang && (
        <div style={{ padding: "6px 12px", borderBottom: `1px solid ${t.border}`, fontSize: 11, color: t.hint, fontFamily: "monospace" }}>
          {lang}
        </div>
      )}
      <pre style={{ padding: "12px 14px", fontSize: 13, color: "#c4c4e0", lineHeight: 1.6, fontFamily: "'JetBrains Mono','Fira Code',monospace", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {code}
      </pre>
      <div style={{ padding: "6px 12px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: copied ? t.success : t.hint, fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "color .15s" }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ResponseBody({ text }) {
  const blocks = renderMarkdown(text);
  return (
    <div style={{ fontSize: 14, lineHeight: 1.75, color: t.text }}>
      {blocks.map((b, i) =>
        b.type === "code" ? (
          <CodeBlock key={i} lang={b.lang} code={b.code} />
        ) : (
          <p key={i} style={{ margin: i === 0 ? 0 : "10px 0 0" }} dangerouslySetInnerHTML={{ __html: b.html }} />
        )
      )}
    </div>
  );
}

export default function AIResponseOutput({ prompt = "", text = "", isStreaming = false, timestamp }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [streamedText, setStreamedText] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isStreaming || !text) return;
    setStreamedText("");
    const words = text.split(" ");
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i >= words.length) { clearInterval(timerRef.current); return; }
      i += Math.floor(Math.random() * 3) + 1;
      setStreamedText(words.slice(0, i).join(" "));
    }, 40);
    return () => clearInterval(timerRef.current);
  }, [isStreaming, text]);

  const displayText = isStreaming ? streamedText : text;
  const isComplete = !isStreaming;

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedtimeStamp = new Date(timestamp).toLocaleString();

  const ActionBtn = ({ onClick, active, children, style = {} }) => (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
        borderRadius: 7, border: `1px solid ${active ? t.accent : t.border}`,
        background: active ? `${t.accent}18` : t.btnBg,
        color: active ? "#a5b4fc" : t.muted,
        fontSize: 12, fontFamily: "inherit", cursor: "pointer",
        transition: "all .15s", ...style,
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.muted; } }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", maxWidth: 680, margin: "0 auto", padding: "0.5rem 0", minWidth: '900px' }}>
      <div style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 16, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#6366f122", border: "1px solid #6366f144", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>✦</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: t.muted }}>Responding to</div>
            <div style={{ fontSize: 13, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>"{prompt}"</div>
          </div>
          {isStreaming ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a5b4fc" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent, display: "inline-block", animation: "ai-blink 1s infinite" }} />
              Generating
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.hint }}>
              <span style={{ color: t.success }}>✓</span> Done
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px", minHeight: 80 }}>
          <ResponseBody text={displayText} />
          {isStreaming && (
            <span style={{ display: "inline-block", width: 2, height: 14, background: t.accent, borderRadius: 2, marginLeft: 2, verticalAlign: "middle", animation: "ai-blink .7s infinite" }} />
          )}
        </div>

        {/* Toolbar */}
        {isComplete && (
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <ActionBtn onClick={handleCopy} active={copied}>
              {copied ? "✓ Copied" : "Copy"}
            </ActionBtn>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: t.hint, marginRight: 4 }}>Time:</span>
              <span style={{ fontSize: 11, color: t.hint, marginRight: 4 }}>{formattedtimeStamp}</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ai-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .inline-code {
          background: ${t.bgCode}; border: 1px solid ${t.border};
          border-radius: 4px; padding: 1px 5px;
          font-size: 12px; color: #a5b4fc; font-family: monospace;
        }
      `}</style>
    </div>
  );
}