import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, ListRenderItem } from "react-native";

interface OptionSelectorProps<T extends string | number> {
  title: string;
  subtitle?: string;
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  unit?: string;
  theme?: { colors: { primary: string } };
}

function OptionSelector<T extends string | number>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  unit,
}: OptionSelectorProps<T>) {
  const renderItem: ListRenderItem<T> = ({ item }) => {
    const isSelected = selected === item;
    return (
      <TouchableOpacity
        onPress={() => onSelect(item)}
        className="px-2 py-1 rounded-md mx-2"
        style={{
          borderWidth: isSelected ? 1 : 0,
          borderColor: "black",
          backgroundColor: isSelected ? theme.colors.primary : "transparent",
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
  };

 const theme = useTheme();
  return (
    <View className="px-5 mt-6">
      {/* Title + Subtitle */}
      <View className="flex-row items-baseline mb-3">
        <Text className="text-lg font-bold">{title} </Text>
        {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
      </View>

      {/* Options + Unit fixed */}
      <View className="flex-row items-center">
        <FlatList
          data={options}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
        />
        {unit && (
          <Text className="ml-2 text-md font-bold text-gray-600">{unit}</Text>
        )}
      </View>
    </View>
  );
}

export default OptionSelector;
