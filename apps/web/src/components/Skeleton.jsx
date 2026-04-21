import React from "react";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export default function Skeleton({ type = "text", count = 1, style = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const baseStyle = {
    background: `linear-gradient(90deg, ${isDark ? "#223151" : "#ebf3f5"} 0%, ${
      isDark ? "#18253f" : "#dbe8ec"
    } 50%, ${isDark ? "#223151" : "#ebf3f5"} 100%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear",
    borderRadius: "8px",
    ...style,
  };

  const renderSkeleton = (key) => {
    switch (type) {
      case "title":
        return <div key={key} style={{ height: "32px", width: "100%", marginBottom: "16px", ...baseStyle }} />;
      case "stat":
        return (
          <div
            key={key}
            style={{
              height: "120px",
              width: "100%",
              borderRadius: "16px",
              ...baseStyle,
            }}
          />
        );
      case "card":
        return (
          <div
            key={key}
            style={{
              height: "200px",
              width: "100%",
              borderRadius: "16px",
              ...baseStyle,
            }}
          />
        );
      case "text":
      default:
        return <div key={key} style={{ height: "16px", width: "100%", marginBottom: "8px", ...baseStyle }} />;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
}
