import { useTheme } from "@/hooks/useTheme";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";

interface OptionSelectorProps<T extends string | number> {
  title: string;
  subtitle?: string;
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  unit?: string;
}

function OptionSelector<T extends string | number>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  unit,
}: OptionSelectorProps<T>) {
  const theme = useTheme();
  const flatListRef = useRef<FlatList<T | null>>(null);
  const ITEM_WIDTH = 40; // Adjust based on design
  const { width } = Dimensions.get("window");
  const SPACER_WIDTH = (width - ITEM_WIDTH) / 2.5;

  // Scroll to selected when it changes
  useEffect(() => {
    const index = options.indexOf(selected);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: index * ITEM_WIDTH,
        animated: true,
      });
    }
  }, [selected]);

  // Detect which item is centered after scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const centeredIndex = Math.round(offsetX / ITEM_WIDTH);
    const value = options[centeredIndex];
    if (value && value !== selected) onSelect(value);
  };

  return (
    <View>
      {/* Title + Subtitle */}
      <View className="flex-row items-baseline mb-3">
        <Text className="text-lg font-bold">{title} </Text>
        {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
      </View>

      {/* Scrollable Picker-style list */}
      <View className="flex-row items-center">
        <FlatList
          ref={flatListRef}
          data={[null, ...options, null]} // add spacers
          keyExtractor={(item, index) => (item ? item.toString() : `spacer-${index}`)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={handleScroll}
          renderItem={({ item }) => {
            if (item === null) {
              return <View style={{ width: SPACER_WIDTH }} />;
            }

            const isSelected = selected === item;
            return (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                activeOpacity={0.8}
                style={{
                  width: ITEM_WIDTH,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : "transparent",
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: "black",
                }}
              >
                <Text
                  className={`font-bold ${
                    isSelected ? "text-black text-xl" : "text-gray-500 text-md"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        {unit && (
          <Text className="ml-2 text-md font-bold text-gray-600">{unit}</Text>
        )}
      </View>
    </View>
  );
}

export default OptionSelector;
