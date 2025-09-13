import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const ITEM_HEIGHT = 40;
const PICKER_HEIGHT = 120;

type TimePickerProps = {
  label: string;
  value: string; // e.g., "10:00"
  period: string; // Can now be "AM" | "PM" | month
  onChange: (val: string, period: string) => void;
  times: string[];
  periodOptions?: string[]; // AM/PM or Months
};

export default function TimePicker({
  label,
  value,
  period,
  onChange,
  times,
  periodOptions = ["AM", "PM"], // default if not passed
}: TimePickerProps) {
  const scroller = useRef<ScrollView>(null);
  const periodScroller = useRef<ScrollView>(null);

  const padV = useMemo(() => (PICKER_HEIGHT - ITEM_HEIGHT) / 2, []);
  const theme = useTheme();

  const initialIndex = Math.max(0, times.indexOf(value));
  const initialPeriodIndex = Math.max(0, periodOptions.indexOf(period));

  // Scroll to initial value
  useEffect(() => {
    requestAnimationFrame(() => {
      scroller.current?.scrollTo({
        y: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
      periodScroller.current?.scrollTo({
        y: initialPeriodIndex * ITEM_HEIGHT,
        animated: false,
      });
    });
  }, []);

  const handleTimeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const picked = times[Math.min(Math.max(idx, 0), times.length - 1)];
    if (picked && picked !== value) onChange(picked, period);
  };

  const handlePeriodEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const picked =
      periodOptions[Math.min(Math.max(idx, 0), periodOptions.length - 1)];
    if (picked && picked !== period) onChange(value, picked);
  };

  return (
    <View style={{ height: PICKER_HEIGHT, width: "45%" }}>
      <Text className="font-bold text-xl mb-2 ml-4">{label}</Text>
      <View className="flex-row items-center">
        {/* Time Picker */}
        <ScrollView
          ref={scroller}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={handleTimeEnd}
          contentContainerStyle={{ paddingVertical: padV }}
        >
          {times.map((t, idx) => {
            const selected = t === value;
            return (
              <TouchableOpacity
                key={t}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  onChange(t, period);
                  scroller.current?.scrollTo({
                    y: idx * ITEM_HEIGHT,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: selected
                      ? periodOptions.length > 2
                        ? 16 // ✅ months smaller
                        : 20 // ✅ AM/PM bigger
                      : periodOptions.length > 2
                      ? 14
                      : 16,
                    fontWeight: selected ? "bold" : "normal",
                    color: selected ? "#000" : "#6b7280",
                    backgroundColor: selected ? "#e5e7eb" : "transparent",
                    borderWidth: selected ? 1 : 0,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Period Picker (AM/PM or Months) */}
        <ScrollView
          ref={periodScroller}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={handlePeriodEnd}
          contentContainerStyle={{ paddingVertical: padV }}
          style={{ marginLeft: 12 }}
        >
          {periodOptions.map((p, idx) => {
            const selected = p === period;
            return (
              <TouchableOpacity
                key={p}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  onChange(value, p);
                  periodScroller.current?.scrollTo({
                    y: idx * ITEM_HEIGHT,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: selected
                      ? periodOptions.length > 2
                        ? 16 // ✅ months smaller
                        : 20 // ✅ AM/PM bigger
                      : periodOptions.length > 2
                      ? 14
                      : 16,
                    fontWeight: selected ? "bold" : "normal",
                    color: selected ? "#000" : "#6b7280",
                    backgroundColor: selected ? theme.colors.primary : "transparent",
                    borderWidth: selected ? 1 : 0,
                    borderRadius: 8,
                    paddingHorizontal: periodOptions.length > 2 ? 8 : 12,
                    paddingVertical: 4,
                  }}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
