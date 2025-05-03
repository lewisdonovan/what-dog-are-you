import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router/stack';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsProcessing(true);
        
        const response = await fetch('/api/analyse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: result.assets[0].base64,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze photo');
        }

        const data = await response.json();
        
        router.push({
          pathname: '/result',
          params: {
            breed: data.match.breed,
            confidence: data.match.confidence,
            description: data.match.description,
            imageUrl: data.match.imageUrl,
            alternativeMatches: JSON.stringify(data.match.alternativeMatches || []),
          },
        });
      }
    } catch (error) {
      console.error('Error processing photo:', error);
      // We'll add proper error handling later
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'What Dog Are You?' }} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>What Dog Breed Are You?</Text>
          <Text style={styles.description}>
            Upload your photo and our AI will tell you which dog breed you look like!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSelectPhoto}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : 'Select Photo'}
            </Text>
          </TouchableOpacity>
          {isProcessing && <ActivityIndicator style={styles.spinner} />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 16,
  },
}); 