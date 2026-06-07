import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../lib/supabase';

const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), 'public/uploads');

// Ensure local storage directory exists
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

export class StorageService {
  /**
   * Check if Supabase storage is configured
   */
  private static isSupabaseConfigured(): boolean {
    const url = process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    return (
      url.length > 0 &&
      !url.includes('localhost:54321') &&
      key.length > 0 &&
      !key.includes('mock-')
    );
  }

  /**
   * Get a signed upload URL (or a mock local URL if not configured)
   */
  static async getSignedUploadUrl(filename: string): Promise<{ signedUrl: string; key: string }> {
    const uniqueName = `${Date.now()}-${filename}`;
    const bucket = process.env.S3_BUCKET_NAME || 'pokemon-card-uploads';

    if (this.isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .createSignedUploadUrl(uniqueName);

        if (error) throw error;
        if (!data?.signedUrl) throw new Error('Failed to generate signed URL from Supabase Storage');

        return {
          signedUrl: data.signedUrl,
          key: uniqueName,
        };
      } catch (err) {
        console.error('Supabase Storage error, falling back to local storage:', err);
      }
    }

    // Fallback: Local Storage
    const apiPort = process.env.API_PORT || 3001;
    const apiUrl = process.env.API_URL || `http://localhost:${apiPort}`;
    const signedUrl = `${apiUrl}/uploads/mock/${uniqueName}`;

    return {
      signedUrl,
      key: uniqueName,
    };
  }

  /**
   * Save file locally (called by mock upload endpoint)
   */
  static async saveLocalFile(filename: string, fileBuffer: Buffer): Promise<string> {
    const filePath = path.join(LOCAL_STORAGE_DIR, filename);
    await fs.promises.writeFile(filePath, fileBuffer);
    return filename;
  }

  /**
   * Get public download/view URL for a file
   */
  static getPublicUrl(key: string): string {
    const bucket = process.env.S3_BUCKET_NAME || 'pokemon-card-uploads';

    if (this.isSupabaseConfigured()) {
      const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(key);
      return data.publicUrl;
    }

    // Local file fallback
    const apiPort = process.env.API_PORT || 3001;
    const apiUrl = process.env.API_URL || `http://localhost:${apiPort}`;
    return `${apiUrl}/static-uploads/${key}`;
  }

  /**
   * Read file content as Buffer (for OCR extraction)
   */
  static async getFileBuffer(key: string): Promise<Buffer> {
    const bucket = process.env.S3_BUCKET_NAME || 'pokemon-card-uploads';

    if (this.isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.storage.from(bucket).download(key);
      if (error) throw error;
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // Local file fallback
    const filePath = path.join(LOCAL_STORAGE_DIR, key);
    return fs.promises.readFile(filePath);
  }
}
