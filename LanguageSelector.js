import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Modal, Portal, Text, Searchbar, Divider } from 'react-native-paper';

const ALL_LANGUAGES = [
  'Arabic', 'Chinese', 'Dutch', 'English', 'French', 'German', 'Hindi', 'Italian',
  'Japanese', 'Korean', 'Portuguese', 'Russian', 'Spanish', 'Swahili',
  'Turkish', 'Ukrainian', 'Urdu', 'Vietnamese', 'Filipino', 'Thai', 'Persian', 'Greek', 'Hebrew', 'Polish', 'Malay', 'Indonesian', 'Danish', 'Norwegian', 'Finnish', 'Romanian', 'Hungarian', 'Czech', 'Slovak', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Punjabi'
];

export default function LanguageSelector({ visible, onDismiss, onSelect, recent = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = ALL_LANGUAGES.filter(lang =>
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { onSelect(item); onDismiss(); }}>
      <View style={styles.item}><Text>{item}</Text></View>
      <Divider />
    </TouchableOpacity>
  );

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Searchbar
          placeholder="Search language..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />

        {recent.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Recently Used</Text>
            <FlatList
              data={recent}
              keyExtractor={(item) => item}
              renderItem={renderItem}
            />
            <Divider style={{ marginVertical: 10 }} />
          </View>
        )}

        <Text style={styles.sectionTitle}>All Languages</Text>
        <FlatList
          data={filteredLanguages}
          keyExtractor={(item) => item}
          renderItem={renderItem}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 16,
    maxHeight: '90%',
  },
  item: {
    padding: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  searchbar: {
    marginBottom: 12,
  },
});
