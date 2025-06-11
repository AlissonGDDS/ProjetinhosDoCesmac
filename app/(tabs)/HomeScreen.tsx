import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Share, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTransactions } from '../context/TransactionsContext';
import { useUserName } from '../hooks/useUserName';
import { useUserBalance } from '../hooks/useUserBalance';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;

export default function HomeScreen() {
  const router = useRouter();
  const { name: userName, loading: loadingName } = useUserName();
  const { balance, loading: loadingBalance } = useUserBalance();
  const { darkMode, toggleTheme } = useTheme();
  const { transactions } = useTransactions();
  const [menuVisible, setMenuVisible] = useState(false);

  const saldo = transactions.reduce((acc, t) => t.type === 'Entrada' ? acc + t.amount : acc - t.amount, 0);
  const totalEntradas = transactions.filter(t => t.type === 'Entrada').reduce((acc, t) => acc + t.amount, 0);
  const totalSaidas = transactions.filter(t => t.type === 'Saída').reduce((acc, t) => acc + t.amount, 0);

  function AnimatedButton({ children, style, onPress }: any) {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        style={({ hovered: isHovered }) => [
          style,
          (hovered || isHovered) && { transform: [{ scale: 1.05 }], opacity: 0.85, shadowOpacity: 0.18 },
        ]}
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        {children}
      </Pressable>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Meu saldo atual no Adominus Wealth é R$ ${saldo.toFixed(2).replace('.', ',')}`,
      });
    } catch (error) {
      // opcional: alertar erro
    }
  };

  function goTo(path: string) {
    setMenuVisible(false);
    router.replace(path as any);
  }

  const backgroundColor = darkMode ? '#111' : '#f5f7fa';
  const cardBg = darkMode ? '#222' : '#fff';
  const textColor = darkMode ? '#fff' : '#222';
  const subTextColor = darkMode ? '#bbb' : '#888';
  const cardLabelColor = darkMode ? '#bbb' : '#888';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Botão hamburguer */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 32, left: 16, zIndex: 10 }}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>
      {/* Menu lateral */}
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)} activeOpacity={1} />
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/HomeScreen')}>
            <Ionicons name="home" size={24} color="#222" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/TransactionsScreen')}>
            <Ionicons name="swap-horizontal" size={24} color="#222" />
            <Text style={styles.menuText}>Transações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/ReportsScreen')}>
            <Ionicons name="bar-chart" size={24} color="#222" />
            <Text style={styles.menuText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/ProfileScreen')}>
            <Ionicons name="person" size={24} color="#222" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/RegisterScreen')}>
            <Ionicons name="person-add" size={24} color="#222" />
            <Text style={styles.menuText}>Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/explore')}>
            <Ionicons name="search" size={24} color="#222" />
            <Text style={styles.menuText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text style={[styles.greeting, { color: textColor }]}>
        Olá,{' '}
        {loadingName ? '...' : (
          <Text style={styles.greetingName}>{userName || 'Usuário'}</Text>
        )} 👋
      </Text>
      <Text style={[styles.subtitle, { color: subTextColor }]}>Bem-vindo ao Adominus Wealth!</Text>
      <View style={[styles.card, { backgroundColor: cardBg, shadowColor: darkMode ? '#fff' : '#000' }]}>
        <Text style={[styles.cardLabel, { color: cardLabelColor }]}>Saldo Atual</Text>
        <Text style={[styles.cardValue, { color: '#1E90FF' }]}>
          {loadingBalance ? '...' : balance !== null ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
        </Text>
        <View style={styles.row}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="arrow-downward" size={22} color="#4CAF50" />
            <Text style={[styles.summaryLabel, { color: cardLabelColor }]}>Entradas</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>R$ {totalEntradas.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialIcons name="arrow-upward" size={22} color="#F44336" />
            <Text style={[styles.summaryLabel, { color: cardLabelColor }]}>Saídas</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>R$ {totalSaidas.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <AnimatedButton style={styles.actionButton} onPress={() => router.push('/TransactionsScreen')}>
          <MaterialIcons name="list" size={24} color="#fff" />
          <Text style={styles.actionText}>Transações</Text>
        </AnimatedButton>
        <AnimatedButton style={styles.actionButton} onPress={() => router.push('/ReportsScreen')}>
          <MaterialIcons name="bar-chart" size={24} color="#fff" />
          <Text style={styles.actionText}>Relatórios</Text>
        </AnimatedButton>
        <AnimatedButton style={styles.actionButton} onPress={() => router.push({ pathname: '/TransactionsScreen', params: { add: '1' } })}>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionText}>Adicionar</Text>
        </AnimatedButton>
      </View>
      <AnimatedButton style={styles.themeButton} onPress={toggleTheme}>
        <Text style={[styles.themeButtonText, { color: darkMode ? '#fff' : '#222' }]}>Alternar modo {darkMode ? 'claro' : 'escuro'}</Text>
      </AnimatedButton>
      <AnimatedButton style={styles.themeButton} onPress={handleShare}>
        <Text style={[styles.themeButtonText, { color: darkMode ? '#fff' : '#222' }]}>Compartilhar saldo</Text>
      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#222',
  },
  greetingName: { color: '#1E90FF' },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: { fontSize: 16, color: '#888', marginBottom: 6 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#1E90FF', marginBottom: 12 },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 14, color: '#888', marginTop: 4 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 2,
    gap: 4,
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  themeButton: {
    marginTop: 32,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  themeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
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
    left: 0, // <-- correto, abre do lado esquerdo
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