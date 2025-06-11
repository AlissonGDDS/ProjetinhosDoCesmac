import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Text, StyleSheet } from 'react-native';

export default function HamburgerMenu() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  function goToHome() {
    setMenuVisible(false);
    router.replace('/HomeScreen');
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)} activeOpacity={1} />
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={goToHome}>
            <Ionicons name="home" size={24} color="#222" />
            <Text style={styles.menuText}>Ir para Home</Text>
          </TouchableOpacity>
          {/* Adicione outros botões do menu aqui */}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#222',
  },
});