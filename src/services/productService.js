import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const PRODUCTS_COLLECTION = 'products';

/**
 * Escuta em tempo real os produtos pertencentes exclusivamente ao usuário autenticado.
 */
export const subscribeUserProducts = (userId, onUpdate, onError) => {
  if (!isFirebaseConfigured || !db || !userId) {
    if (onError) {
      onError(new Error('Firebase ou usuário não disponível'));
    }
    return () => {};
  }

  // Consulta filtrando estritamente pelo UID do usuário autenticado
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Ordena por data de criação decrescente na memória para não exigir índices compostos no Firestore
      items.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      });

      onUpdate(items);
    },
    (error) => {
      console.error('Erro ao buscar produtos do Firestore:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Cadastra um novo produto vinculado ao usuário logado
 */
export const createProduct = async (userId, data) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Banco de dados Firebase não configurado.');
  }
  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  const payload = {
    userId,
    nome: data.nome.trim(),
    quantidade: Math.max(0, parseInt(data.quantidade, 10) || 0),
    preco: Math.max(0, parseFloat(data.preco) || 0),
    categoria: (data.categoria || 'Geral').trim(),
    estoqueMinimo: Math.max(0, parseInt(data.estoqueMinimo, 10) || 5),
    codigo: (data.codigo || '').trim().toUpperCase(),
    descricao: (data.descricao || '').trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Atualiza um produto existente
 */
export const updateProduct = async (productId, data) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Banco de dados Firebase não configurado.');
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const payload = {
    nome: data.nome.trim(),
    quantidade: Math.max(0, parseInt(data.quantidade, 10) || 0),
    preco: Math.max(0, parseFloat(data.preco) || 0),
    categoria: (data.categoria || 'Geral').trim(),
    estoqueMinimo: Math.max(0, parseInt(data.estoqueMinimo, 10) || 5),
    codigo: (data.codigo || '').trim().toUpperCase(),
    descricao: (data.descricao || '').trim(),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
  return { id: productId, ...payload };
};

/**
 * Remove um produto do Firestore
 */
export const deleteProduct = async (productId) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Banco de dados Firebase não configurado.');
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
  return true;
};
