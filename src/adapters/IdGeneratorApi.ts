export type IdGeneratorApi = {
    generateId: () => string;
  };
  
  export const UUIDGeneratorApi = {
    generateId: () => {
      return crypto.randomUUID();
    },
  };
  