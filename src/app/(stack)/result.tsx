import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BreedMatch } from '@/types/api';

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    breed: string;
    confidence: string;
    description: string;
    imageUrl: string;
    alternativeMatches: string;
  }>();

  const alternativeMatches = params.alternativeMatches 
    ? JSON.parse(params.alternativeMatches)
    : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Dog Breed Match!</Text>
          <Text style={styles.subtitle}>
            You are a{' '}
            <Text style={styles.highlight}>
              {Math.round(Number(params.confidence) * 100)}%
            </Text>{' '}
            match with a {params.breed}
          </Text>
        </View>

        <View style={styles.content}>
          {params.imageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: params.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.breedName}>{params.breed}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailsContainer}>
            {params.description && (
              <View style={styles.traitsContainer}>
                <Text style={styles.sectionTitle}>Traits & Characteristics</Text>
                <View style={styles.traits}>
                  {params.description.split(',').map((trait, index) => (
                    <View key={index} style={styles.traitBadge}>
                      <Text style={styles.traitText}>{trait.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {alternativeMatches.length > 0 && (
              <View style={styles.alternativesContainer}>
                <Text style={styles.sectionTitle}>Alternative Matches</Text>
                {alternativeMatches.map((match: { breed: string; confidence: number }, index: number) => (
                  <View key={index} style={styles.alternativeMatch}>
                    <Text style={styles.alternativeBreed}>{match.breed}</Text>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>
                        {Math.round(match.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Try Another Photo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  highlight: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  breedName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    gap: 24,
  },
  traitsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  traitText: {
    fontSize: 14,
    color: '#666',
  },
  alternativesContainer: {
    gap: 8,
  },
  alternativeMatch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  alternativeBreed: {
    fontSize: 14,
    fontWeight: '500',
  },
  confidenceBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 