import React, { useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, Button, Text, Appbar, Snackbar } from 'react-native-paper';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [recordingText, setRecordingText] = useState('');

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

    setIsRecognizing(true); // Set recognizing state to true
    setRecordingText('Recording...'); // Set recording text

    Voice.onSpeechResults = (event) => {
      setRecognizedText(event.value[0]); // Update recognized text
      setVisible(true); // Show Snackbar with recognized text
      setIsRecognizing(false); // Set recognizing state to false
      setRecordingText(''); // Clear recording text
    };

    try {
      await Voice.start('en-US'); // Start voice recognition
    } catch (error) {
      console.error(error);
      setIsRecognizing(false); // Handle error and set recognizing state to false
      setRecordingText(''); // Clear recording text
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Voice Recognition App" style={styles.appbarContent} />
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Nhấn vào nút bên dưới để bắt đầu nhận diện giọng nói
        </Text>
        <Button mode="contained" onPress={startRecognizing} style={styles.button}>
          Start Recognizing
        </Button>
        {recordingText ? (
          <View style={styles.recordingContainer}>
            <ActivityIndicator size="small" color="#61DAFB" />
            <Text style={styles.recordingText}>{recordingText}</Text>
          </View>
        ) : null}
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
  appbar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appbarContent: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282C34',
    padding: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#61DAFB',
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#61DAFB',
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  recordingText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 20,
  },
  recognizedText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 20,
  },
});

export default App;
