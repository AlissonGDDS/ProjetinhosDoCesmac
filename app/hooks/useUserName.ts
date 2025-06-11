import { useEffect, useState } from 'react';
import { db } from '../config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

export function useUserName() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchName() {
      setLoading(true);
      try {
        const user = getAuth().currentUser;
        if (!user) {
          setName(null);
          setLoading(false);
          return;
        }
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setName(querySnapshot.docs[0].data().name || null);
        } else {
          setName(null);
        }
      } catch (e) {
        setName(null);
      } finally {
        setLoading(false);
      }
    }
    fetchName();
  }, []);

  return { name, loading };
}

export async function addUser(name: string, email: string) {
  const userCredential = await signInAnonymously(getAuth());
  await addDoc(collection(db, 'users'), {
    name: name,
    email: email,
    createdAt: new Date(),
    uid: userCredential.user.uid,
  });
}
