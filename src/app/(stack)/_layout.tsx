import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'What Dog Are You?',
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Your Dog Match',
        }}
      />
    </Stack>
  );
} 