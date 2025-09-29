// in app/(app)/scanner.js
import { View, Text } from 'react-native';
import React from 'react';

export default function Scanner() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, textAlign: 'center', padding: 20 }}>
        The Barcode Scanner feature is coming soon!
      </Text>
    </View>
  );
}