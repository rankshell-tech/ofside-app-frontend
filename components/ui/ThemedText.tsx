import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary';
  weight?: 'regular' | 'medium' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  variant = 'primary',
  weight = 'regular',
  size = 'base',
  ...props 
}) => {
  const theme = useTheme();
  
  const color = variant === 'primary' ? theme.colors.text : theme.colors.textSecondary;
  
  const fontWeight = {
    regular: '400',
    medium: '500',
    bold: '700',
  }[weight];

  const fontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  }[size];

  return (
    <Text 
      style={[
        { 
          color, 
          fontWeight, 
          fontSize,
          fontFamily: 'Inter-Regular',
        }, 
        style
      ]} 
      {...props} 
    />
  );
};