import { MigrationInterface, getConnection, createConnection } from 'typeorm';
import nz from '../data/nz_shooting_clean';
import admissions from '../data/nz_shooting_clean';

const tweets = nz.concat(admissions);

export class Init1559013086896 implements MigrationInterface {
  public async up(): Promise<any> {
    await createConnection();
    const connection = await getConnection();

    for (const tweet of tweets) {
      const { tweet_id, text } = tweet;

      await connection.query(
        `
          INSERT INTO "tweet" ("id", "text", "active", "metadata")
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("id")
            DO NOTHING
        `,
        [tweet_id, text, true, {}]
      );
    }

    await connection.query(
      `
        INSERT INTO "subject" ("id")
          VALUES ($1)
      `,
      ['default-subject-id']
    );
  }

  public async down(): Promise<any> {}
}
