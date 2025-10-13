// App.js
import React, { useState } from 'react';
import * as Speech from 'expo-speech';
import { ImageBackground } from 'react-native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Button,
  Provider as PaperProvider,
} from 'react-native-paper';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';

export default function App() {
  return (
    <PaperProvider>
      <TranslatorApp />
    </PaperProvider>
  );
}

function TranslatorApp() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [modelUsed, setModelUsed] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [useCasualPhrasing, setUseCasualPhrasing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [recentLangs, setRecentLangs] = useState([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const translateText = async () => {
    try {
      const response = await axios.post('http://192.168.1.109:3000/translate', {
        text: inputText,
        targetLang: targetLang,
        native: useCasualPhrasing,
      });

      setTranslatedText(response.data.translation);
      setModelUsed(response.data.modelUsed);
      setHistory(prev => [
        { input: inputText, output: response.data.translation, lang: targetLang },
        ...prev.slice(0, 4),
      ]);
    } catch (error) {
      console.error(error);
      setTranslatedText('Error: Could not connect to server.');
      setModelUsed('');
    }
  };

  const speak = () => {
    if (translatedText) {
      Speech.speak(translatedText, {
        language: mapLanguageToCode(targetLang),
      });
    }
  };

  const mapLanguageToCode = (lang) => {
    const codes = {
      Arabic: 'ar', Chinese: 'zh', Dutch: 'nl', English: 'en', French: 'fr',
      German: 'de', Hindi: 'hi', Italian: 'it', Japanese: 'ja', Korean: 'ko',
      Portuguese: 'pt', Russian: 'ru', Spanish: 'es', Swahili: 'sw', Turkish: 'tr',
      Ukrainian: 'uk', Urdu: 'ur', Vietnamese: 'vi', Filipino: 'tl', Thai: 'th',
      Persian: 'fa', Greek: 'el', Hebrew: 'he', Polish: 'pl', Malay: 'ms',
      Indonesian: 'id', Danish: 'da', Norwegian: 'no', Finnish: 'fi', Romanian: 'ro',
      Hungarian: 'hu', Czech: 'cs', Slovak: 'sk', Bengali: 'bn', Tamil: 'ta',
      Telugu: 'te', Marathi: 'mr', Punjabi: 'pa'
    };
    return codes[lang] || 'en';
  };

  const handleLanguageSelect = (lang) => {
    setTargetLang(lang);
    setRecentLangs(prev => [lang, ...prev.filter(l => l !== lang)].slice(0, 5));
  };

  return (
    <ImageBackground
      source={require('./assets/flags.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Casual Language Translator</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter text to translate"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <View style={styles.section}>
          <Text style={styles.label}>Target Language</Text>
          <Button mode="outlined" onPress={() => setLanguageModalVisible(true)}>
            {targetLang}
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Use Casual Phrasing</Text>
          <Button
            mode="contained"
            onPress={() => setUseCasualPhrasing(!useCasualPhrasing)}
          >
            {useCasualPhrasing ? 'On' : 'Off'}
          </Button>
        </View>

        <Text style={styles.toggleHint}>Turn on for more natural, conversational tone.</Text>

        <View style={styles.section}>
          <Button mode="contained" onPress={translateText}>
            Translate
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.resultLabel}>Translated:</Text>
          <Text style={styles.result}>{translatedText}</Text>
        </View>

        {modelUsed ? (
          <View style={styles.modelBadge}>
            <Text style={styles.modelBadgeText}>🧠 Translation powered by {modelUsed}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Button mode="outlined" onPress={speak}>
            🔊 Play
          </Button>
        </View>

        {history.length > 0 && (
          <View style={styles.section}>
            <Button
              mode="outlined"
              onPress={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </Button>
          </View>
        )}

        {showHistory && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Translation History</Text>
            <ScrollView style={styles.historyScroll}>
              {history.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyInput}>
                    {item.input} → {item.lang}
                  </Text>
                  <Text>{item.output}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <LanguageSelector
          visible={languageModalVisible}
          onDismiss={() => setLanguageModalVisible(false)}
          onSelect={handleLanguageSelect}
          recent={recentLangs}
        />

        <Text style={styles.credit}>Made with ❤️ by Aveng George Lumilan</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  background: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#003366',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  toggleHint: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  resultLabel: {
    fontWeight: 'bold',
  },
  result: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
  },
  modelBadge: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#dfe7f5',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  modelBadgeText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#003366',
  },
  historyContainer: {
    marginTop: 30,
  },
  historyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  historyScroll: {
    maxHeight: 200,
  },
  historyItem: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  historyInput: {
    fontWeight: 'bold',
  },
  credit: {
    marginTop: 40,
    fontSize: 11,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});
