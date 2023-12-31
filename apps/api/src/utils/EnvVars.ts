import dotenv from "dotenv";
import envVar from "env-var";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export class EnvVars {
  public static CLIENT_ID = envVar.get("CLIENT_ID").required().asString();
  public static CLIENT_SECRET = envVar.get("CLIENT_SECRET").required().asString();
  public static COOKIE_SECRET = envVar.get("COOKIE_SECRET").required().asString();
  public static JWT_SECRET = envVar.get("JWT_SECRET").required().asString();
  public static S3_ENDPOINT = envVar.get("S3_ENDPOINT").required().asString();
  public static S3_BUCKET_NAME = envVar.get("S3_BUCKET_NAME").required().asString();
  public static S3_ACCESS_KEY = envVar.get("S3_ACCESS_KEY").required().asString();
  public static S3_SECRET_KEY = envVar.get("S3_SECRET_KEY").required().asString();
  public static PORT = envVar.get("PORT").required().asPortNumber();
  public static HOST = envVar.get("HOST").required().asString();
}