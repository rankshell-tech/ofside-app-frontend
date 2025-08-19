import React from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface SearchBarProps extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  onSearchPress?: () => void;
  placeholder?: string;
  showSearchButton?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  onSearchPress,
  placeholder = 'Search venues...',
  showSearchButton = false,
  ...textInputProps
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.searchContainer, { borderColor: theme.colors.border }]}>
        <Search size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          {...textInputProps}
        />
        {showSearchButton && onSearchPress && (
          <TouchableOpacity 
            onPress={onSearchPress} 
            style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
          >
            <ThemedText size="sm" weight="medium" style={{ color: theme.colors.accent }}>
              Search
            </ThemedText>
          </TouchableOpacity>
        )}
        {onFilterPress && (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Filter size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  filterButton: {
    padding: 4,
  },
});