import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserName } from '../hooks/useUserName';
import { useUserBalance } from '../hooks/useUserBalance';
import { getAuth, signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { name, loading } = useUserName();
  const { balance, loading: loadingBalance } = useUserBalance();
  const user = getAuth().currentUser;
  const { darkMode } = useTheme();

  function goToHome() {
    router.replace('/HomeScreen');
  }
  function handleLogout() {
    signOut(getAuth());
    router.replace('/');
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#f5f7fa' }]}>
      <TouchableOpacity style={{ position: 'absolute', top: 32, left: 16, zIndex: 10 }} onPress={goToHome}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.avatar}
          onError={() => {}}
        />
      </View>
      <Text style={styles.name}>{loading ? '...' : (name || 'Usuário')}</Text>
      <Text style={styles.email}>{user?.email || 'email@email.com'}</Text>
      <Text style={{ fontSize: 18, color: '#1E90FF', marginBottom: 18 }}>
        Saldo: {loadingBalance ? '...' : balance !== null ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.sectionItem, { color: '#F44336', fontWeight: 'bold' }]}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  avatarContainer: { marginBottom: 18, borderRadius: 60, overflow: 'hidden', borderWidth: 2, borderColor: '#eee' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 16, color: '#888', marginBottom: 18 },
  section: { width: '100%', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 18, alignItems: 'flex-start', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  sectionItem: { fontSize: 15, color: '#666', marginBottom: 8 },
});