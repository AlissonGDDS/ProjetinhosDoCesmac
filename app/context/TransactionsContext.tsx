import React, { createContext, useContext, useState, ReactNode } from 'react';
import { db } from '../config';
import { collection, addDoc, getDocs, query, orderBy, where, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export type Transaction = {
  id: string;
  type: 'Entrada' | 'Saída';
  amount: number;
  date: string;
};

interface TransactionsContextProps {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
  loading: boolean;
  error: string | null;
}

const TransactionsContext = createContext<TransactionsContextProps | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  // Buscar transações do Firestore ao carregar
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    const user = getAuth().currentUser;
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Transaction[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    }, (e) => {
      setError('Erro ao buscar transações.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addTransaction(t: Omit<Transaction, 'id'>) {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error('Usuário não autenticado');
      const docRef = await addDoc(collection(db, 'transactions'), { ...t, uid: user.uid });
      // Calcula o novo saldo do usuário de forma reativa
      const novoSaldo = transactions.reduce((acc, tr) => tr.type === 'Entrada' ? acc + tr.amount : acc - tr.amount, 0)
        + (t.type === 'Entrada' ? t.amount : -t.amount);
      await setDoc(doc(db, 'users', user.uid), { saldo: novoSaldo }, { merge: true });
      setTransactions(prev => [
        { ...t, id: docRef.id, uid: user.uid },
        ...prev,
      ]);
    } catch (e) {
      setError('Erro ao adicionar transação.');
      console.error('Erro ao adicionar transação:', e);
    }
  }

  function removeTransaction(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function clearTransactions() {
    setTransactions([]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, removeTransaction, clearTransactions, loading, error }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions deve ser usado dentro de TransactionsProvider');
  return ctx;
}
