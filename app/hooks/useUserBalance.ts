import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config';
import { getAuth } from 'firebase/auth';

export function useUserBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      setBalance(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setBalance(snap.data()?.saldo ?? 0);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { balance, loading };
}
