// OutlinedText.tsx
import React from "react";
import { View, Text, StyleProp, TextStyle } from "react-native";

type Props = {
  text: string | number;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

const OutlinedText: React.FC<Props> = ({
  text,
  fontSize = 32,
  fontWeight = "900",
  fillColor = "#FFD700",   // default yellow
  strokeColor = "black",   // default black stroke
  strokeWidth = 1,
}) => {
  const offsets = [-strokeWidth, strokeWidth];

  return (
    <View style={{ position: "relative" }}>
      {/* Stroke layer */}
      {offsets.map((dx) =>
        offsets.map((dy) => (
          <Text
            key={`${dx}-${dy}`}
            style={{
              position: "absolute",
              fontSize,
              fontWeight,
              color: strokeColor,
              left: dx,
              top: dy,
            }}
          >
            {text}
          </Text>
        ))
      )}

      {/* Fill layer */}
      <Text style={{ fontSize, fontWeight, color: fillColor }}>{text}</Text>
    </View>
  );
};

export default OutlinedText;
