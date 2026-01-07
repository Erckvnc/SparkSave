import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoalsProvider } from './src/context/GoalsContext';
import { NotificationProvider, useNotification } from './src/context/NotificationContext';
import Toast from './src/components/Toast';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AddGoalScreen from './src/screens/AddGoalScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsStack from './src/navigation/SettingsStack';
import HomeStack from './src/navigation/HomeStack';

const Tab = createBottomTabNavigator();

import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <GoalsProvider>
        <NotificationProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: '#1a1a1a',
                    borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    paddingBottom: 5,
                    height: 60,
                  },
                  tabBarActiveTintColor: '#ff8c00',
                  tabBarInactiveTintColor: '#a0a0a0',
                  tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                  },
                  tabBarIconStyle: {
                    marginBottom: -5,
                  },
                })}
              >
                <Tab.Screen
                  name="HomeTab"
                  component={HomeStack}
                  options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                      <StartIcon color={color} size={size} icon="🏠" />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Add Goal"
                  component={AddGoalScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <StartIcon color={color} size={size} icon="➕" />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Stats"
                  component={StatsScreen}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <StartIcon color={color} size={size} icon="📊" />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsStack}
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <StartIcon color={color} size={size} icon="⚙️" />
                    ),
                  }}
                />
              </Tab.Navigator>
              <ToastConsumer />
            </NavigationContainer>
          </SafeAreaProvider>
        </NotificationProvider>
      </GoalsProvider>
    </ErrorBoundary>
  );
}

const ToastConsumer = () => {
  const { notification } = useNotification();
  return <Toast message={notification.message} visible={notification.visible} />;
};

// Simple Text Icon wrapper to preserve the original look
import { Text } from 'react-native';
const StartIcon = ({ color, size, icon }) => (
  <Text style={{ color, fontSize: 24 }}>{icon}</Text>
);
