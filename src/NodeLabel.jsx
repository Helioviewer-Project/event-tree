import { useEffect, useRef, useState } from "react";
import React from "react";
import Checkbox from "./Checkbox.jsx";
import { EnabledTriangle, DisabledTriangle } from "./Icons.jsx";

/*
 * TEMPORARY HACK: Fixes title display issues before fixing the problem at the source
 * 
 * This function handles malformed title strings by:
 * 1. Unicode escape sequences like \u03b1 (with backslash)
 * 2. Unicode sequences like u03b2 (without backslash)
 * 3. Replace newline escape sequences \n with space
 * 4. HTML entities like &deg; &amp; &lt; &gt; &quot; &#39;
 * 
 * Can handle any Unicode character in the Basic Multilingual Plane (U+0000 to U+FFFF)
 */
export const fixTitle = (title) => {
  return title
    // Handle Unicode escape sequences with backslash
    .replace(/\\u([\da-fA-F]{4})/g, function (m, $1) {
      return String.fromCharCode(parseInt($1, 16));
    })
    // Handle Unicode sequences without backslash (u followed by 4 hex digits)
    .replace(/u([\da-fA-F]{4})/g, function (m, $1) {
      return String.fromCharCode(parseInt($1, 16));
    })
    // Replace newline escape sequences with space
    .replace(/\\n/g, ' ')
    // Handle common HTML entities
    .replace(/&deg;/g, '°')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

export default function NodeLabel({ onLabelHover, offLabelHover, onLabelClick, label, dataTestId }) {
  const [hovered, setHovered] = useState(false);

  let labelStyle = {};

  if (hovered) {
    labelStyle = {
      background: "#a8c0ca",
      color: "black"
    };
  }

  labelStyle.cursor = "pointer";

  return (
    <span
      data-testid={dataTestId}
      style={labelStyle}
      onMouseEnter={() => {
        setHovered(true);
        onLabelHover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        offLabelHover();
      }}
      onClick={onLabelClick}
    >
      {fixTitle(label)}
    </span>
  );
}
