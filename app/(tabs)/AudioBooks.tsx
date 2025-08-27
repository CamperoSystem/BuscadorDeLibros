// app/tabs/AudioBooks.tsx
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { addFavorite } from '../../utils/storage';

// Función para limpiar HTML
const stripHtml = (html: string) => {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&apos;/g, "'");
  return text;
};

export default function AudioBooksScreen() {
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const res = await fetch(
          'https://librivox.org/api/feed/audiobooks?format=json&language=Spanish&limit=20'
        );
        const data = await res.json();
        setAudiobooks(data.books || []);
      } catch (error) {
        console.log('Error al obtener audiolibros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  const playAudio = async (url: string, id: string) => {
    try {
      if (!url) {
        Alert.alert('Error', 'No hay audio disponible para este libro');
        return;
      }

      if (playingId === id && sound) {
        const status = await sound.getStatusAsync();
        if ('isPlaying' in status && status.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        return;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 1);
            if (status.didJustFinish) {
              setPlayingId(null);
              setSound(null);
            }
          }
        }
      );

      setSound(newSound);
      setPlayingId(id);
    } catch (error) {
      console.log('Error al reproducir audio:', error);
      Alert.alert('Error', 'No se pudo reproducir el audio');
    }
  };

  const handleAddFavorite = async (book: any) => {
    try {
      await addFavorite(book);
      Alert.alert('Favorito', 'Audiolibro añadido a favoritos');
    } catch (error) {
      console.log('Error al añadir favorito:', error);
      Alert.alert('Error', 'No se pudo añadir a favoritos');
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audiolibros en Español</Text>
      <FlatList
        data={audiobooks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedBook(item);
              setModalVisible(true);
            }}
          >
            {item.cover_url ? (
  <Image source={{ uri: item.cover_url }} style={styles.thumbnail} />
) : (
  <View style={[styles.thumbnail, styles.noImage]}>
    <Ionicons name="headset" size={40} color="#888" />
  </View>
)}

            <Text style={styles.bookTitle} numberOfLines={2}>
              {stripHtml(item.title)}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {item.authors
                ?.map((a: any) => a.first_name + ' ' + a.last_name)
                .join(', ') || 'Desconocido'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal estilo limpio */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {selectedBook?.cover_url ? (
  <Image
    source={{ uri: selectedBook.cover_url }}
    style={styles.modalImage}
  />
) : (
  <View style={[styles.modalImage, styles.noImage]}>
    <Ionicons name="headset" size={80} color="#888" />
  </View>
)}

              <Text style={styles.modalTitle}>{stripHtml(selectedBook?.title)}</Text>
              <Text style={styles.modalAuthor}>
                {selectedBook?.authors
                  ?.map((a: any) => a.first_name + ' ' + a.last_name)
                  .join(', ') || 'Desconocido'}
              </Text>
              <Text style={styles.modalDescription}>
                {selectedBook?.description
                  ? stripHtml(selectedBook.description)
                  : 'Sin descripción disponible.'}
              </Text>

              {/* Barra de progreso */}
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ccc"
                onSlidingComplete={async (val) => {
                  if (sound) await sound.setPositionAsync(val);
                }}
              />
              <View style={styles.timeRow}>
                <Text>{formatTime(position)}</Text>
                <Text>{formatTime(duration)}</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    playingId === selectedBook?.id && { backgroundColor: '#005BBB' },
                  ]}
                  onPress={() =>
                    playAudio(selectedBook?.url_zip_file || '', selectedBook?.id)
                  }
                >
                  <Text style={styles.playButtonText}>
                    {playingId === selectedBook?.id ? '⏸ Pausar' : '▶ Reproducir'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleAddFavorite(selectedBook)}
                >
                  <Text style={styles.favoriteButtonText}>⭐ Favorito</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖ Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: { width: 100, height: 140, borderRadius: 8, marginBottom: 8 },
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  bookTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#333' },
  bookAuthor: { color: '#666', fontSize: 12, marginBottom: 5, textAlign: 'center' },

  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalImage: { width: 200, height: 280, alignSelf: 'center', borderRadius: 10, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#222' },
  modalAuthor: { fontSize: 14, textAlign: 'center', marginBottom: 10, color: '#666' },
  modalDescription: { fontSize: 14, lineHeight: 20, marginBottom: 15, color: '#555' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  playButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 50, width: '30%', alignItems: 'center' },
  playButtonText: { color: '#fff', fontSize: 16 },
  favoriteButton: { backgroundColor: '#ff9500', padding: 12, borderRadius: 50, width: '30%', alignItems: 'center' },
  favoriteButtonText: { color: '#fff', fontSize: 16 },
  closeButton: { backgroundColor: '#888', padding: 12, borderRadius: 50, width: '30%', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 16 },
});
