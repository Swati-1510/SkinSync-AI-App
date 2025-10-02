import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// This component will be a simple pop-up form
export default function JournalEntryModal({ visible, onClose, onSave }) {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (note.trim()) {
      onSave(note.trim()); // Pass the note up to the parent page
      setNote(''); // Clear the input field
    }
    onClose(); // Close the modal regardless
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible} // Controlled by the parent's state
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl p-6 shadow-2xl" style={{ width: wp(85) }}>
          
          <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green mb-4">
            What's your skin story today?
          </Text>

          <TextInput
            multiline
            placeholder="Write your observation here (e.g., 'Skin felt tight,' 'Noticed a new breakout,' 'The new serum felt great.')"
            placeholderTextColor="#B2AC88"
            value={note}
            onChangeText={setNote}
            style={{ height: hp(15) }}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-dark-olive-green"
          />

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity onPress={onClose} className="py-2 px-4 rounded-full border border-muted-khaki">
              <Text className="text-muted-khaki font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSave} 
              className="py-2 px-4 rounded-full bg-primary"
              disabled={!note.trim()} // Disable the button if the text box is empty
            >
              <Text className="text-white font-bold">Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}