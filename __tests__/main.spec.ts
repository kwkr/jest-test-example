import { handler as lambdaHandler } from "../src/index";

const mockAddBulk = jest.fn();
const mockCloseQueue = jest.fn();

jest.mock("../src/db", () => {
  return {
    DbWrapper: function () {
      return {
        getUserIds: () => {
          return [2];
        },
        close: () => {},
      };
    },
  };
});

jest.mock("../src/queue", () => {
  return function () {
    return {
      addBulk: mockAddBulk,
      close: mockCloseQueue,
    };
  };
});

jest.mock("../src/config", () => {
  return {
    getPostgresConnectionString: () => "confidential-connection-string",
  };
});

jest.mock("../src/queue-dependency");

describe("handler", () => {
  beforeEach(() => {
    mockAddBulk.mockClear();
    mockCloseQueue.mockClear();
  });

  it("can run without errors", async () => {
    await lambdaHandler();
  });

  it("adds 2 jobs for each user to the queue", async () => {
    const numberOfUsers = 1;
    const jobsPerUser = 2;
    await lambdaHandler();
    expect(mockAddBulk.mock.calls[0][0].length).toBe(
      numberOfUsers * jobsPerUser
    );
  });

  it("closes connection to the queue after the request", async () => {
    await lambdaHandler();
    expect(mockCloseQueue.mock.calls.length).toBe(1);
  });
});
