import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {ToastProvider} from 'react-native-toasty-toast';
import {
  NotificationListener,
  requestUserPermission,
} from './src/hooks/NotificationHook';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
          <ToastProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ToastProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
