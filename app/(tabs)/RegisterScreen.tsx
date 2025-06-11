import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();
  const { darkMode } = useTheme();

  function goToHome() {
    router.replace('/HomeScreen');
  }

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Salva o e-mail no Firestore
      await addDoc(collection(db, 'users'), {
        name: name,
        email: email,
        createdAt: new Date(),
        uid: userCredential.user.uid,
      });
      Alert.alert('Sucesso', 'Conta cadastrada com sucesso!');
      // Redirecione ou mostre sucesso
      router.replace('/HomeScreen');
    } catch (error) {
      if (error instanceof Error) {
        alert('Erro ao cadastrar: ' + error.message);
      } else {
        alert('Erro ao cadastrar: ' + String(error));
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#f5f7fa' }]}>
      <TouchableOpacity style={{ position: 'absolute', top: 32, left: 16, zIndex: 10 }} onPress={goToHome}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: {
    width: 260,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
});
