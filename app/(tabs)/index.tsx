import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = ['Ficción', 'No Ficción', 'Tecnología', 'Historia'];

export default function HomeScreen() {
  const router = useRouter();
  const [booksByCategory, setBooksByCategory] = useState<Record<string, any[]>>({});
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      const data: Record<string, any[]> = {};
      for (const cat of categories) {
        try {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(cat)}&maxResults=10`
          );
          const json = await res.json();
          data[cat] = json.items || [];
        } catch (error) {
          console.log(`Error fetching ${cat}:`, error);
          data[cat] = [];
        }
      }
      setBooksByCategory(data);
    };

    fetchCategoryBooks();
  }, []);

  const searchBooks = async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=15`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.log('Error al buscar libros:', error);
    }
  };

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(5)].map((_, i) => (
        <Text key={i} style={{ color: i < rating ? '#FFD700' : '#ccc', fontSize: 12 }}>★</Text>
      ))}
    </View>
  );

  const renderBookCard = (item: any) => {
    const info = item.volumeInfo || {};
    const rating = info.averageRating || Math.floor(Math.random() * 5) + 1;
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
        <Text style={styles.bookTitle} numberOfLines={2}>{info.title || 'Sin título'}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{info.authors?.join(', ') || 'Desconocido'}</Text>
        {renderStars(rating)}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>BookUPDS</Text>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar libro..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Resultados de búsqueda */}
      {searchResults.length > 0 && (
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.categoryTitle}>Resultados para "{query}"</Text>
          <FlatList
            data={searchResults}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderBookCard(item)}
          />
        </View>
      )}

      {/* Categorías */}
      {categories.map((cat) => (
        <View key={cat} style={{ marginBottom: 20 }}>
          <Text style={styles.categoryTitle}>{cat}</Text>
          <FlatList
            data={booksByCategory[cat] || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderBookCard(item)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 15 },
  searchContainer: { flexDirection: 'row', marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  categoryTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  card: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: { width: 80, height: 120, borderRadius: 6, marginBottom: 8 },
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  bookTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  bookAuthor: { color: '#666', fontSize: 12, marginBottom: 5, textAlign: 'center' },
});
