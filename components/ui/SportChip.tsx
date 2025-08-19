import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SportType } from '@/types';
import { sports } from '@/constants/theme';

interface SportChipProps {
  sport: SportType;
  selected: boolean;
  onPress: () => void;
}

export const SportChip: React.FC<SportChipProps> = ({ sport, selected, onPress }) => {
  const theme = useTheme();
  const sportData = sports.find(s => s.id === sport);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{sportData?.icon}</Text>
      <Text
        style={[
          styles.text,
          {
            color: selected ? theme.colors.accent : theme.colors.textSecondary,
            fontWeight: selected ? '600' : '400',
          },
        ]}
      >
        {sportData?.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});