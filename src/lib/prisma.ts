import { PrismaClient } from "@prisma/client";

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaInstance.instance) {
      PrismaInstance.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return PrismaInstance.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaInstance.instance) {
      await PrismaInstance.instance.$disconnect();
    }
  }

  public static async connect(): Promise<void> {
    await PrismaInstance.getInstance().$connect();
  }
}

// Use in development to log queries
if (process.env.NODE_ENV === "development") {
  PrismaInstance.getInstance().$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
    return result;
  });
}

// Export the prisma instance
export const prisma = PrismaInstance.getInstance();

// Export the class for testing and special cases
export default PrismaInstance;
