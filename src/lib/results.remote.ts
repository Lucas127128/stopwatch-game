import { command, query } from "$app/server";
import { array, number, object, safeParse, string, type InferOutput } from "valibot";
import { env } from "cloudflare:workers";
import bcrypt from "bcryptjs";
import { BCRYPTED_PW } from "$app/env/private";

const dbSchema = array(
  object({
    user_name: string(),
    time_taken: number(),
    created_at: string(),
  }),
);
type DbSchema = InferOutput<typeof dbSchema>;

export const addResult = command(
  object({ username: string(), timeTaken: number() }),
  async ({ username, timeTaken }) => {
    const { DB } = env;
    const setQuery = DB.prepare("INSERT INTO results (user_name, time_taken) VALUES (?, ?)");
    await setQuery.bind(username, timeTaken).run();
  },
);

export const getResult = query<{ sucess: true; data: DbSchema } | { sucess: false; error: string }>(
  async () => {
    const { DB } = env;
    const getQuery = DB.prepare("SELECT user_name, time_taken, created_at FROM results");
    const result = await getQuery.run();
    if (result.success) {
      const { success, output: rows } = safeParse(dbSchema, result.results);
      if (success) {
        return { sucess: true, data: rows };
      } else {
        return { sucess: false, error: "Failed to parse results" };
      }
    } else {
      return { sucess: false, error: "Failed to retrieve results" };
    }
  },
);

export const removeResult = query(
  object({ createdAt: string(), password: string() }),
  async ({ createdAt, password }) => {
    const isValid = await bcrypt.compare(password, BCRYPTED_PW);
    console.log(bcrypt.hashSync(password));
    if (!isValid) {
      return { fail: true, message: "Invalid password" };
    }
    const { DB } = env;
    const deleteQuery = DB.prepare("DELETE FROM results WHERE created_at = ?");
    await deleteQuery.bind(createdAt).run();
    await getResult().refresh();
  },
);
