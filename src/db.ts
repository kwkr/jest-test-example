import { createPool, DatabasePoolType, sql } from "slonik";

export class DbWrapper {
  private pool: DatabasePoolType;
  constructor(connectionString: string) {
    this.pool = createPool(connectionString);
  }

  public async getUserIds() {
    return await this.pool.connect(async (connection) => {
      return connection.manyFirst<{ id: number }>(
        sql`
        SELECT id FROM "users";
      `
      );
    });
  }

  async close() {
    await this.pool.end();
  }
}
