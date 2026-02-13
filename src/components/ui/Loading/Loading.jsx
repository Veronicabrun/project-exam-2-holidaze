// src/components/ui/utils
export default function Loading({ text = "Loading..." , fullScreen = false }) {
  const Wrapper = fullScreen ? "div" : "div";

  return (
    <Wrapper
      style={{
        ...(fullScreen
          ? {
              position: "fixed",
              inset: 0,
              background: "rgba(255,255,255,0.75)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              padding: 16,
            }
          : {
              display: "grid",
              placeItems: "center",
              padding: 16,
            }),
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "4px solid #ddd",
            borderTopColor: "#111",
            animation: "spin 0.9s linear infinite",
          }}
        />

        <p style={{ margin: 0, opacity: 0.8 }}>{text}</p>

        {/* keyframes inline */}
        <style>{`
          @keyframes spin { 
            to { transform: rotate(360deg); } 
          }
        `}</style>
      </div>
    </Wrapper>
  );
}
