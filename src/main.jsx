import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Root render error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{ minHeight: "100vh", padding: "20px", color: "#ffd3d3", background: "#1c0f12" }}
        >
          <h2 style={{ marginTop: 0 }}>Application Error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found");
}

createRoot(container).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
