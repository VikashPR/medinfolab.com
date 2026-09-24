// Replace these read functions with Firestore queries when the data source is connected.
// Keeping the boundary here prevents the UI from depending on a CMS or server filesystem.
export async function getCollection<T>(collectionName: string): Promise<T[]> {
  void collectionName;
  return [];
}
