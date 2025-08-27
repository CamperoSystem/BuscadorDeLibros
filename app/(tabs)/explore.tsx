import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFavorites } from '../../utils/storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const router = useRouter();

  // Cada vez que la pantalla gana foco, recargamos favoritos
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs || []);
      };
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Mis Favoritos</Text>

      {favorites.length === 0 ? (
        <Text style={styles.noFavorites}>No hay favoritos aún.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const info = item.volumeInfo || {};
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/book/${item.id}`)}
              >
                {info.imageLinks?.thumbnail ? (
                  <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.thumbnail} />
                ) : (
                  <View style={[styles.thumbnail, styles.noImage]}>
                    <Text style={{ color: '#888', fontSize: 12 }}>Sin imagen</Text>
                  </View>
                )}
                <View style={styles.details}>
                  <Text style={styles.title} numberOfLines={2}>
                    {info.title || 'Sin título'}
                  </Text>
                  <Text style={styles.author} numberOfLines={1}>
                    {info.authors?.join(', ') || 'Desconocido'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  noFavorites: { padding: 20, textAlign: 'center', color: '#666' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: { width: 60, height: 90, borderRadius: 6, marginRight: 12 },
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  details: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  author: { color: '#666', fontSize: 14 },
});


