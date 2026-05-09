import { useState, useRef, useEffect, useCallback } from "react";

const SUGGESTIONS = [
  "Summarize this in 3 bullet points",
  "Write a professional email about",
  "Explain the concept of",
  "Generate 5 creative ideas for",
  "Debug this code and explain:",
  "Create a step-by-step plan for",
];

const CHAR_LIMIT = 2000;

const MODES = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "code", label: "Code", icon: "⌨️" },
];

const PLACEHOLDERS = {
  chat: "Ask anything — or type / for templates",
  code: "Describe what to build, or paste code…",
  creative: "Give me a theme or starting idea…",
};

// Dark theme tokens
const t = {
  bg: "#1a1a2e",           // card background
  bgHover: "#22223a",      // hover surface
  bgInput: "#13131f",      // textarea bg
  border: "#2e2e4a",       // default border
  borderFocus: "#6366f1",  // focus border (indigo)
  borderActive: "#6366f1",
  text: "#e8e8f0",         // primary text
  textMuted: "#8888aa",    // muted text
  textHint: "#55556a",     // hint/placeholder
  accent: "#6366f1",       // indigo accent
  accentHover: "#4f46e5",
  accentText: "#ffffff",
  chipBg: "#22223a",
  chipBorder: "#2e2e4a",
  btnBg: "#22223a",
  btnBorder: "#2e2e4a",
  btnHover: "#2e2e4a",
  danger: "#f87171",
};

export default function AIPromptInput({ onSubmit, placeholder, isLoading }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState("chat");
  const [showSugs, setShowSugs] = useState(false);
  const [activeSug, setActiveSug] = useState(-1);
  const textareaRef = useRef(null);

  const getSugs = useCallback(() => {
    if (!value.startsWith("/")) return [];
    const q = value.slice(1).toLowerCase();
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 5);
  }, [value]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 260) + "px";
    const sugs = getSugs();
    setShowSugs(sugs.length > 0);
  }, [value, getSugs]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading || value.length > CHAR_LIMIT) return;
    onSubmit?.(value.trim(), mode);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    const sugs = getSugs();
    if (showSugs) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSug((p) => Math.min(p + 1, sugs.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveSug((p) => Math.max(p - 1, -1)); return; }
      if (e.key === "Enter" && activeSug >= 0) { e.preventDefault(); setValue(sugs[activeSug] + " "); setShowSugs(false); setActiveSug(-1); return; }
      if (e.key === "Escape") { setShowSugs(false); return; }
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const charsLeft = CHAR_LIMIT - value.length;
  const isOver = charsLeft < 0;
  const isNear = charsLeft < 200;
  const canSend = !!value.trim() && !isLoading && !isOver;
  const sugs = getSugs();

  return (
    <>
      <div style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", maxWidth: 680, margin: "0 auto", padding: "1rem 0", minWidth: '900px' }}>

        {/* Suggestion chips */}
        {!value && mode === 'chat' && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {SUGGESTIONS.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => { setValue(s + " "); textareaRef.current?.focus(); }}
                style={{ background: t.chipBg, border: `1px solid ${t.chipBorder}`, borderRadius: 100, padding: "5px 14px", fontSize: 12, color: t.textMuted, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.chipBorder; e.currentTarget.style.color = t.textMuted; }}
              >
                {s.length > 36 ? s.slice(0, 36) + "…" : s}
              </button>
            ))}
            <button style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: 100, padding: "5px 14px", fontSize: 12, color: t.textHint, fontFamily: "inherit", cursor: "default" }}>
              type / for templates
            </button>
          </div>
        )}

        {/* Card */}
        <div style={{
          background: t.bg,
          border: `1.5px solid ${isOver ? t.danger : focused ? t.borderFocus : t.border}`,
          borderRadius: 16,
          position: "relative",
          transition: "border-color 0.2s",
          boxShadow: focused ? `0 0 0 3px ${t.accent}22` : "none",
        }}>

          {/* Mode tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", borderBottom: `1px solid ${t.border}` }}>
            {MODES.map((m) => (
              <button key={m.id} onClick={() => { setMode(m.id); textareaRef.current?.focus(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8,
                  fontSize: 12, fontFamily: "inherit", fontWeight: mode === m.id ? 500 : 400,
                  border: `1px solid ${mode === m.id ? t.accent : "transparent"}`,
                  background: mode === m.id ? `${t.accent}22` : "transparent",
                  color: mode === m.id ? "#a5b4fc" : t.textMuted,
                  cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={(e) => { if (mode !== m.id) { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.text; } }}
                onMouseLeave={(e) => { if (mode !== m.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textMuted; } }}
              >
                <span style={{ fontSize: 13 }}>{m.icon}</span>{m.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {isNear && (
              <span style={{ fontSize: 11, color: isOver ? t.danger : t.textHint, fontVariantNumeric: "tabular-nums" }}>
                {isOver ? `−${Math.abs(charsLeft)}` : charsLeft} left
              </span>
            )}
          </div>

          {/* Autocomplete */}
          {showSugs && sugs.length > 0 && (
            <div style={{ position: "absolute", top: 52, left: 0, right: 0, zIndex: 99, background: t.bg, border: `1px solid ${t.accent}`, borderRadius: 10, overflow: "hidden", boxShadow: `0 8px 24px #00000066` }}>
              <div style={{ padding: "6px 12px", fontSize: 11, color: t.textHint, borderBottom: `1px solid ${t.border}` }}>Templates</div>
              {sugs.map((s, i) => (
                <div key={i}
                  onMouseDown={() => { setValue(s + " "); setShowSugs(false); setActiveSug(-1); }}
                  onMouseEnter={() => setActiveSug(i)}
                  style={{ padding: "9px 12px", fontSize: 13, cursor: "pointer", background: i === activeSug ? t.bgHover : "transparent", color: i === activeSug ? t.text : t.textMuted, borderBottom: i < sugs.length - 1 ? `1px solid ${t.border}` : "none", transition: "background .1s" }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { if (e.target.value.length <= CHAR_LIMIT + 50) setValue(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTimeout(() => setShowSugs(false), 150); }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || PLACEHOLDERS[mode]}
            rows={1}
            style={{
              width: "100%", padding: "14px 16px", background: "transparent",
              border: "none", outline: "none", resize: "none",
              fontSize: 14, lineHeight: 1.65, fontFamily: "inherit",
              color: t.text, boxSizing: "border-box",
              minHeight: 56, maxHeight: 260, overflowY: "auto", display: "block",
            }}
          />

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", gap: 8, borderTop: `1px solid ${t.border}` }}>
            {[{ icon: "📎", title: "Attach" }, { icon: "🎤", title: "Voice" }].map((btn, i) => (
              <button key={i} title={btn.title}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.btnBorder}`, background: t.btnBg, color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.btnBorder; e.currentTarget.style.color = t.textMuted; }}
              >
                {btn.icon}
              </button>
            ))}

            <div style={{ flex: 1 }} />

            {!value && <span style={{ fontSize: 11, color: t.textHint }}>↵ send · ⇧↵ newline</span>}

            <button onClick={handleSubmit} disabled={!canSend}
              style={{
                height: 34, padding: "0 18px", borderRadius: 8, border: "none",
                background: canSend ? t.accent : t.btnBg,
                color: canSend ? "#fff" : t.textHint,
                cursor: canSend ? "pointer" : "not-allowed",
                fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
                transition: "background .2s, color .2s",
              }}
              onMouseEnter={(e) => { if (canSend) e.currentTarget.style.background = t.accentHover; }}
              onMouseLeave={(e) => { if (canSend) e.currentTarget.style.background = t.accent; }}
            >
              {isLoading ? (
                <>
                  <span style={{ width: 12, height: 12, border: "1.5px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "ai-spin .6s linear infinite" }} />
                  Sending
                </>
              ) : "Send ↑"}
            </button>
          </div>
        </div>

        <style>{`
        @keyframes ai-spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #55556a; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: #2e2e4a; border-radius: 4px; }
      `}</style>
      </div>
    </>

  );
}