import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { lightTheme, darkTheme } from '@/constants/theme';

export const useTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return isDark ? darkTheme : lightTheme;
};