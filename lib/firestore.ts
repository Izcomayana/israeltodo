import { db } from "./firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  DocumentData,
  Timestamp,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export async function fetchTasks(userId: string): Promise<Task[]> {
  const colRef = collection(db, "users", userId, "tasks");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      text: data.text,
      completed: data.completed,
      createdAt: data.createdAt?.seconds * 1000 || Date.now(),
    };
  });
}

export async function saveTasks(userId: string, tasks: Task[]): Promise<void> {
  const batch = writeBatch(db);
  const basePath = `users/${userId}/tasks`;

  // Clear all old tasks
  const existing = await getDocs(collection(db, basePath));
  for (const docSnap of existing.docs) {
    batch.delete(docSnap.ref);
  }

  // Add current tasks
  for (const task of tasks) {
    const docRef = doc(db, basePath, task.id);
    batch.set(docRef, {
      text: task.text,
      completed: task.completed,
      createdAt: Timestamp.fromMillis(task.createdAt),
    });
  }
  await batch.commit();
}