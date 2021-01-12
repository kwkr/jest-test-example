import { getPostgresConnectionString } from "./config";
import { DbWrapper } from "./db";
import QueueWrapper, { BulkJobParameter, JobData } from "./queue";
import { QueueDependency } from "./queue-dependency";

const JOB_TYPES = ["example-type-1", "example-type-2"] as const;

export const handler = async (): Promise<unknown> => {
  const connectionString = await getPostgresConnectionString();
  const dbWrapper = new DbWrapper(connectionString);
  const dependency = new QueueDependency();
  const queueWrapper = new QueueWrapper(dependency);
  try {
    const userIds = await dbWrapper.getUserIds();
    const jobs: BulkJobParameter<JobData> = [];

    for (const userId of userIds) {
      for (const jobType of JOB_TYPES) {
        jobs.push({
          data: {
            jobType,
            userId,
          },
        });
      }
    }
    await queueWrapper.addBulk(jobs);
  } finally {
    await queueWrapper.close();
    await dbWrapper.close();
  }
  return { statusCode: 200, body: "Done!" };
};
