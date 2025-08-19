import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  background?: 'primary' | 'surface';
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  background = 'primary',
  ...props 
}) => {
  const theme = useTheme();
  
  const backgroundColor = background === 'primary' 
    ? theme.colors.background 
    : theme.colors.surface;

  return (
    <View 
      style={[{ backgroundColor }, style]} 
      {...props} 
    />
  );
};