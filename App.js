import React, { useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import { Provider as PaperProvider, Button, Text, Appbar, Snackbar } from 'react-native-paper';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [visible, setVisible] = useState(false);

  const startRecognizing = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to recognize speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    Voice.onSpeechResults = (event) => {
      setRecognizedText(event.value[0]);
      setVisible(true);
    };

    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Voice Recognition App" />
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Nhấn vào nút bên dưới để bắt đầu nhận diện giọng nói
        </Text>
        <Button mode="contained" onPress={startRecognizing} style={styles.button}>
          Start Recognizing
        </Button>
        <Text style={styles.recognizedText}>{recognizedText}</Text>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={Snackbar.DURATION_SHORT}
        >
          {recognizedText}
        </Snackbar>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  recognizedText: {
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
    fontSize: 20,
  },
});

export default App;
