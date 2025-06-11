import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useTransactions } from '../context/TransactionsContext';
import { useTheme } from '../context/ThemeContext';
import { useUserBalance } from '../hooks/useUserBalance';

export default function TransactionsScreen() {
  const { add } = useLocalSearchParams();
  const { transactions, addTransaction, loading, error } = useTransactions();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'Entrada' | 'Saída'>('Entrada');
  const [amount, setAmount] = useState('');
  const { darkMode } = useTheme();

  const { balance, loading: loadingBalance } = useUserBalance();

  React.useEffect(() => {
    if (add === '1') {
      setModalVisible(true);
    }
  }, [add]);

  const saldo = transactions.reduce((acc, t) => {
    const valor = typeof t.amount === 'number' ? t.amount : 0;
    return t.type === 'Entrada' ? acc + valor : acc - valor;
  }, 0);

  function handleAddTransaction() {
    if (!amount) {
      Alert.alert('Erro', 'Informe o valor da transação.');
      return;
    }
    addTransaction({
      type,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString('pt-BR'),
    });
    setModalVisible(false);
    setAmount('');
    setType('Entrada');
  }

  function goTo(path: string) {
    setMenuVisible(false);
    router.replace(path as any);
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#f5f7fa' }]}>
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
      <Text style={styles.saldoLabel}>Saldo Atual</Text>
      <Text style={styles.saldo}>
        R$ {saldo.toFixed(2).replace('.', ',')}
      </Text>
      <Text style={styles.title}>Histórico de Transações</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={{ marginVertical: 30 }} />
      ) : error ? (
        <Text style={{ color: 'red', alignSelf: 'center', marginVertical: 20 }}>{error}</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transaction}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={item.type === 'Entrada' ? 'arrow-downward' : 'arrow-upward'}
                  size={28}
                  color={item.type === 'Entrada' ? '#4CAF50' : '#F44336'}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.type, { color: item.type === 'Entrada' ? '#4CAF50' : '#F44336' }]}>
                  {item.type}
                </Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Text style={[styles.amount, { color: item.type === 'Entrada' ? '#4CAF50' : '#F44336' }]}>
                {typeof item.amount === 'string' ? item.amount : `R$ ${item.amount.toFixed(2).replace('.', ',')}`}
              </Text>
            </View>
          )}
          style={{ marginBottom: 20 }}
        />
      )}
      <Button title="Adicionar Transação" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Transação</Text>
            <View style={styles.typeSwitch}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Entrada' && styles.typeButtonSelected]}
                onPress={() => setType('Entrada')}
              >
                <Text style={{ color: type === 'Entrada' ? '#fff' : '#4CAF50' }}>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Saída' && styles.typeButtonSelectedSaida]}
                onPress={() => setType('Saída')}
              >
                <Text style={{ color: type === 'Saída' ? '#fff' : '#F44336' }}>Saída</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Valor (ex: 100.00)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
              <Button title="Adicionar" onPress={handleAddTransaction} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center', color: '#333' },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: { marginRight: 14 },
  infoContainer: { flex: 1 },
  type: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 12, color: '#888' },
  amount: { fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 18 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    fontSize: 16,
  },
  typeSwitch: {
    flexDirection: 'row',
    marginBottom: 18,
    width: '100%',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonSelectedSaida: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  saldoLabel: { fontSize: 18, color: '#888', alignSelf: 'center', marginTop: 10 },
  saldo: { fontSize: 28, fontWeight: 'bold', color: '#1E90FF', alignSelf: 'center', marginBottom: 18 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0, // <-- agora abre do lado esquerdo
    width: 250,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
    borderLeftWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#222',
  },
});