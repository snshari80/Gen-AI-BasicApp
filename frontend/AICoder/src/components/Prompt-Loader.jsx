export default function AIResponseLoader({ prompt = "Generating response" }) {
  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", maxWidth: 680, margin: "0 auto", padding: "0.5rem 0", minWidth: '900px' }}>
      <div style={{
        background: "#1a1a2e",
        border: "1.5px solid #6366f1",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 0 0 3px #6366f122",
      }}>

        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #2e2e4a", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#6366f122", border: "1px solid #6366f144", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>✦</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#8888aa", marginBottom: 4 }}>Generating response</div>
            <Shimmer width="55%" height={12} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a5b4fc" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "ai-blink 1s infinite" }} />
            Thinking…
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <Shimmer width="92%" />
          <Shimmer width="78%" />
          <Shimmer width="85%" />

          <div style={{ height: 4 }} />

          <Shimmer width="88%" />
          <Shimmer width="60%" />

          <div style={{ height: 4 }} />

          {/* Code block skeleton */}
          <div style={{ background: "#13131f", border: "1px solid #2e2e4a", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "6px 12px", borderBottom: "1px solid #2e2e4a" }}>
              <Shimmer width={60} height={10} />
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <Shimmer width="70%" height={11} />
              <Shimmer width="50%" height={11} />
              <Shimmer width="80%" height={11} />
              <Shimmer width="40%" height={11} />
            </div>
          </div>

          <div style={{ height: 4 }} />
          <Shimmer width="75%" />
          <Shimmer width="45%" />
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid #2e2e4a", display: "flex", alignItems: "center", gap: 8 }}>
          <Shimmer width={72} height={28} radius={7} />
          <Shimmer width={60} height={28} radius={7} />
          <div style={{ flex: 1 }} />
          <Shimmer width={90} height={28} radius={8} />
        </div>
      </div>

      <style>{`
        @keyframes ai-shimmer {
          0% { background-position: -600px 0 }
          100% { background-position: 600px 0 }
        }
        @keyframes ai-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .ai-shimmer {
          background: linear-gradient(90deg, #22223a 25%, #2e2e50 50%, #22223a 75%);
          background-size: 600px 100%;
          animation: ai-shimmer 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}

function Shimmer({ width = "100%", height = 13, radius = 6 }) {
  return (
    <div
      className="ai-shimmer"
      style={{ width, height, borderRadius: radius }}
    />
  );
}