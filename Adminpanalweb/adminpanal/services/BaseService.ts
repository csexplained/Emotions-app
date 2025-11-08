import { databases, Query, ID, type Models, type AppwriteDocument } from '../lib/appwrite-config';

export interface CreateDocumentParams {
  [key: string]: any;
}

export interface UpdateDocumentParams {
  [key: string]: any;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export class BaseService<T extends AppwriteDocument> {
  constructor(protected collectionId: string) {}

  // Create document - use any type to bypass strict type checking
  async create(document: CreateDocumentParams): Promise<T> {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        this.collectionId,
        ID.unique(),
        document as any // Bypass strict type checking
      ) as T;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionId}:`, error);
      throw error;
    }
  }

  // Get document by ID
  async getById(documentId: string): Promise<T> {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        this.collectionId,
        documentId
      ) as T;
    } catch (error) {
      console.error(`Error getting document ${documentId} from ${this.collectionId}:`, error);
      throw error;
    }
  }

  // Get all documents with optional queries
  async getAll(queries: string[] = []): Promise<Models.DocumentList<T>> {
    try {
      return await databases.listDocuments<T>(
        DATABASE_ID,
        this.collectionId,
        queries
      );
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionId}:`, error);
      throw error;
    }
  }

  // Update document - use any type to bypass strict type checking
  async update(documentId: string, updates: UpdateDocumentParams): Promise<T> {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        documentId,
        updates as any // Bypass strict type checking
      ) as T;
    } catch (error) {
      console.error(`Error updating document ${documentId} in ${this.collectionId}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(documentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        this.collectionId,
        documentId
      );
    } catch (error) {
      console.error(`Error deleting document ${documentId} from ${this.collectionId}:`, error);
      throw error;
    }
  }
}