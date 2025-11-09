export interface ApiResponse<T> {
  documents: T[];
  total: number;
}

export interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}