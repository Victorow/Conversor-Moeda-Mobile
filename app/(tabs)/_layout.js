// app/(tabs)/_layout.js

import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#63b3ed', // Cor do ícone ativo
        tabBarInactiveTintColor: '#a0aec0', // Cor do ícone inativo
        tabBarStyle: {
          backgroundColor: '#1a202c', // Cor de fundo da barra de abas
          borderTopColor: '#4a5568',
        },
        headerShown: false, // Vamos remover o cabeçalho padrão
      }}
    >
      <Tabs.Screen
        name="index" // Isso se refere ao arquivo index.js
        options={{
          title: 'Conversor', // Texto abaixo do ícone
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="exchange" color={color} />,
        }}
      />
      {/* Se você quisesse outra aba, adicionaria outro Tabs.Screen aqui */}
    </Tabs>
  );
}
