import { useContext } from 'react'
import { ThemeContext } from '../providers/ThemProvider';

const useTheme = () => {
  const value = useContext(ThemeContext);

  return value
}

export default useTheme