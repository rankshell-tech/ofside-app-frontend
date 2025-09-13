import React, { useEffect, useState } from "react";
import { Image, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

type IconifyProps = {
  icon: string;           // e.g. "mdi:home"
  size?: number;          // default 24
  color?: string;         // optional (works for SVG + PNG)
  style?: ViewStyle;      // optional custom styles
  type?: "png" | "svg";   // force PNG or SVG
};

export default function Iconify({
  icon,
  size = 24,
  color,
  style,
  type = "png", // default PNG (safer)
}: IconifyProps) {
  const [svgXml, setSvgXml] = useState<string | null>(null);

  // If SVG, fetch icon XML
  useEffect(() => {
    if (type === "svg") {
      const url = `https://api.iconify.design/${icon}.svg${
        color ? `?color=${encodeURIComponent(color)}` : ""
      }`;
      fetch(url)
        .then((res) => res.text())
        .then(setSvgXml)
        .catch(() => setSvgXml(null));
    }
  }, [icon, color, type]);

  if (type === "svg") {
    if (!svgXml) return null;
    return <SvgXml xml={svgXml} width={size} height={size} style={style} />;
  }

  // Fallback: PNG (works everywhere)
  const url = `https://api.iconify.design/${icon}.png${
    color ? `?color=${encodeURIComponent(color)}` : ""
  }`;

  return (
    <Image
      source={{ uri: url }}
      style={[{ width: size, height: size }]}
      resizeMode="contain"
    />
  );
}
