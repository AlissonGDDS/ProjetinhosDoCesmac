import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Share, Modal } from 'react-native';
const { PieChart } = require('react-native-chart-kit');
import { useTransactions } from '../context/TransactionsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserBalance } from '../hooks/useUserBalance';
import { useTheme } from '../context/ThemeContext';


interface MonthData { [key: string]: { Entrada: number; Saída: number } }

// Mostra apenas as entradas e saídas das 10 transações mais recentes, e exibe os valores no gráfico e no resumo com o prefixo R$
function getPieDataByMonth(transactions: Array<{ id: string; type: 'Entrada' | 'Saída'; amount: number; date: string }>) {
  // Ordena por data (assumindo formato dd/mm/yyyy)
  const sorted = [...transactions].sort((a, b) => {
    const [da, ma, ya] = a.date.split('/').map(Number);
    const [db, mb, yb] = b.date.split('/').map(Number);
    const dateA = new Date(ya, ma - 1, da);
    const dateB = new Date(yb, mb - 1, db);
    return dateB.getTime() - dateA.getTime();
  });
  // Pega as 10 transações mais recentes
  const recent = sorted.slice(0, 10);
  let entrada = 0;
  let saida = 0;
  recent.forEach(t => {
    if (t.type === 'Entrada') entrada += t.amount;
    if (t.type === 'Saída') saida += t.amount;
  });
  return [
    {
      name: `Entradas: R$ ${entrada.toFixed(2).replace('.', ',')}`,
      amount: entrada,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 15,
      legendFontAlign: 'left',
    },
    {
      name: `Saídas: R$ ${saida.toFixed(2).replace('.', ',')}`,
      amount: saida,
      color: '#F44336',
      legendFontColor: '#333',
      legendFontSize: 15,
      legendFontAlign: 'left',
    },
  ];
}

export default function ReportsScreen() {
  const { transactions } = useTransactions();
  const { balance, loading: loadingBalance } = useUserBalance();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { darkMode } = useTheme();

  function goTo(path: string) {
    setMenuVisible(false);
    router.replace(path as any);
  }

  const pieData = getPieDataByMonth(transactions);
  const screenWidth = Dimensions.get('window').width;

  // Atualiza o resumoBox para mostrar apenas os valores das transações mais recentes, sem prefixo duplicado:
  function getResumoTexto() {
    const entradas = pieData[0]?.amount || 0;
    const saidas = pieData[1]?.amount || 0;
    return `Resumo financeiro das últimas 10 transações:\nEntradas: R$ ${entradas.toFixed(2).replace('.', ',')}\nSaídas: R$ ${saidas.toFixed(2).replace('.', ',')}`;
  }

  async function handleShare() {
    try {
      await Share.share({
        message: getResumoTexto(),
      });
    } catch (error) {}
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
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/NotificationsScreen')}>
            <Ionicons name="notifications" size={24} color="#222" />
            <Text style={styles.menuText}>Notificações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/RegisterScreen')}>
            <Ionicons name="person-add" size={24} color="#222" />
            <Text style={styles.menuText}>Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/ChangePasswordScreen')}>
            <Ionicons name="key" size={24} color="#222" />
            <Text style={styles.menuText}>Alterar Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/PrivacyScreen')}>
            <Ionicons name="shield" size={24} color="#222" />
            <Text style={styles.menuText}>Privacidade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => goTo('/explore')}>
            <Ionicons name="search" size={24} color="#222" />
            <Text style={styles.menuText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text style={styles.title}>Relatórios Financeiros</Text>
      <Text style={styles.subtitle}>Resumo de Entradas e Saídas (mês atual)</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
          labelColor: () => '#333',
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
        style={{ alignSelf: 'center', marginVertical: 16 }}
      />
      {/* Entradas e Saídas abaixo do gráfico */}
      <View style={styles.resumoBox}>
        <Text style={[styles.resumoText, { color: '#4CAF50' }]}> {pieData[0]?.name} </Text>
        <Text style={[styles.resumoText, { color: '#F44336' }]}> {pieData[1]?.name} </Text>
      </View>
      <Text
        style={{
          fontSize: 18,
          color: balance !== null && balance < 0 ? '#F44336' : '#1E90FF',
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        Saldo: {loadingBalance ? '...' : balance !== null ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Compartilhar Resumo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Atualizar Dados</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#222', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' },
  resumoBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  resumoText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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