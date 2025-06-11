import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const techs = [
  { id: '1', name: 'React Native' },
  { id: '2', name: 'Expo' },
  { id: '3', name: 'TypeScript' },
  { id: '4', name: 'Formik' },
  { id: '5', name: 'react-native-chart-kit' },
];

export default function ExploreListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tecnologias usadas no app:</Text>
      <FlatList
        data={techs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 18 },
  item: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, width: '90%', alignSelf: 'center', elevation: 2 },
  itemText: { fontSize: 16, color: '#333' },
});
