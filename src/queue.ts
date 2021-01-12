import Queue, { Queue as QueueType } from "bull";
import { QueueDependency } from "./queue-dependency";

const REDIS_HOST = process.env.REDIS_HOST || "";
const REDIS_PORT = process.env.REDIS_PORT || "";
const WORKER_QUEUE = process.env.WORKER_QUEUE || "";

export type BulkJobParameter<TData = unknown> = Parameters<
  QueueType<TData>["addBulk"]
>[0];

export type JobData = {
  jobType: string;
  userId: number;
};

export default class QueueWrapper {
  queue: QueueType<JobData>;
  constructor(private dependency: QueueDependency) {
    this.queue = new Queue<JobData>(WORKER_QUEUE, {
      redis: `${REDIS_HOST}:${REDIS_PORT}`,
    });
  }

  public async addBulk(jobs: BulkJobParameter<JobData>) {
    await this.dependency.doHeavyStuff();
    await this.queue.addBulk(jobs);
  }

  public async close() {
    await this.queue.close();
  }
}
