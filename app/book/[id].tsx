import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addFavorite } from '../../utils/storage';

// Función para limpiar HTML de la descripción
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const navigation = useNavigation();

  // Cargar libro desde la API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.log('Error al obtener detalles:', error);
      }
    };
    fetchBook();
  }, [id]);

  // Cambiar título de la cabecera dinámicamente
  useLayoutEffect(() => {
    if (book?.volumeInfo?.title) {
      navigation.setOptions({ title: book.volumeInfo.title });
    }
  }, [book]);

  if (!book) return <Text style={{ padding: 20, textAlign: 'center' }}>Cargando...</Text>;

  const info = book.volumeInfo || {};

  const handleAddFavorite = async () => {
    try {
      await addFavorite(book);
      Alert.alert('Favorito', 'Libro añadido a favoritos');
    } catch (error) {
      console.log('Error al añadir favorito:', error);
      Alert.alert('Error', 'No se pudo añadir a favoritos');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen o fallback */}
      {info.imageLinks?.thumbnail ? (
        <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: '#888' }}>Sin imagen</Text>
        </View>
      )}

      {/* Información básica */}
      <Text style={styles.header}>{info.title || 'Sin título'}</Text>
      <Text style={styles.author}>Autor: {info.authors?.join(', ') || 'Desconocido'}</Text>
      <Text style={styles.publisher}>Editorial: {info.publisher || 'Desconocida'}</Text>
      <Text style={styles.date}>Publicado: {info.publishedDate || 'Desconocida'}</Text>

      {/* Descripción */}
      <Text style={styles.description}>
        {info.description ? stripHtml(info.description) : 'Sin descripción disponible.'}
      </Text>

      {/* Campos adicionales */}
      {info.pageCount && <Text style={styles.extra}>Páginas: {info.pageCount}</Text>}
      {info.categories && <Text style={styles.extra}>Categorías: {info.categories.join(', ')}</Text>}
      {info.language && <Text style={styles.extra}>Idioma: {info.language}</Text>}
      {info.previewLink && (
        <Text style={styles.extra}>Vista previa: {info.previewLink}</Text>
      )}

      {/* Botón Favoritos */}
      <View style={styles.buttonContainer}>
        <Button title="Añadir a Favoritos" onPress={handleAddFavorite} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  image: { width: 120, height: 180, alignSelf: 'center', marginBottom: 20, borderRadius: 6 },
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  author: { textAlign: 'center', marginBottom: 5, color: '#666' },
  publisher: { textAlign: 'center', marginBottom: 5 },
  date: { fontStyle: 'italic', textAlign: 'center', marginBottom: 15 },
  description: { marginVertical: 15, lineHeight: 20 },
  extra: { marginBottom: 5, color: '#333', textAlign: 'center' },
  buttonContainer: { marginTop: 20 },
});
