import { SSM } from "aws-sdk";

const POSTGRES_CONN_URI_PARAM_STORE_NAME = process.env.PARAM || "";

const AWS_SSM_API_VERSION = "2014-11-06";

export async function getPostgresConnectionString() {
  const awsSystemManager = new SSM({ apiVersion: AWS_SSM_API_VERSION });
  const params = {
    Name: POSTGRES_CONN_URI_PARAM_STORE_NAME,
    WithDecryption: true,
  };
  const parameterData = await awsSystemManager.getParameter(params).promise();
  const POSTGRES_CONNECTION_URI = parameterData.Parameter?.Value;
  if (!POSTGRES_CONNECTION_URI) {
    throw new Error("Connection URI has no value!");
  }
  return POSTGRES_CONNECTION_URI;
}
