import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites_books';

export async function addFavorite(book: any) {
  const favs = await getFavorites();
  const exists = favs.find((b: any) => b.id === book.id);
  if (!exists) {
    const updated = [...favs, book];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    alert('Libro añadido a favoritos');
  } else {
    alert('Este libro ya está en favoritos');
  }
}

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}
