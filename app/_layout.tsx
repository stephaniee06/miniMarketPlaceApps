import { Stack } from 'expo-router';
import { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const BalanceContext = createContext<any>(null);
export const useBalance = () => useContext(BalanceContext);

export default function Layout() {
  const [balance, setBalance] = useState(100);
  const [ownedProducts, setOwnedProducts] = useState<any[]>([]);
  
 
  const colorScheme = useColorScheme();
  
 
  const [isManualDark, setIsManualDark] = useState<boolean | null>(null);

 
  const isDark = isManualDark !== null ? isManualDark : colorScheme === 'dark';

  const toggleTheme = () => {
    setIsManualDark(!isDark);
  };

  const theme = {
    background: isDark ? '#111827' : '#F5F5F5',
    text: isDark ? '#FFFFFF' : '#1F2937',
    card: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <BalanceContext.Provider value={{ 
      balance, setBalance, 
      ownedProducts, setOwnedProducts,
      theme, isDark, toggleTheme  
    }}>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background } 
      }} />
    </BalanceContext.Provider>
  );
}