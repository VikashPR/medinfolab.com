import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    let snapshot;
    try {
      const q = query(colRef, orderBy("order", "asc"));
      snapshot = await getDocs(q);
    } catch {
      snapshot = await getDocs(colRef);
    }

    const items: T[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as T);
    });
    return items;
  } catch (error) {
    console.error(`Error querying Firestore collection "${collectionName}":`, error);
    return [];
  }
}
