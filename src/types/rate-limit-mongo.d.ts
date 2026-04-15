declare module "rate-limit-mongo" {
  import type { Store, Options } from "express-rate-limit";

  interface MongoStoreOptions {
    uri: string;
    collectionName?: string;
    expireTimeMs?: number;
    resetExpireDateOnChange?: boolean;
    errorHandler?: (error: unknown) => void;
    createTtlIndex?: boolean;
  }

  class MongoStore implements Store {
    constructor(options: MongoStoreOptions);
    increment(key: string): Promise<{ totalHits: number; resetTime: Date | undefined }>;
    decrement(key: string): Promise<void>;
    resetKey(key: string): Promise<void>;
  }

  export = MongoStore;
}
