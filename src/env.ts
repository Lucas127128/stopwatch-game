import { defineEnvVars } from "@sveltejs/kit/env";
import { string } from "valibot";

export const variables = defineEnvVars({
  BCRYPTED_PW: {
    schema: string(),
    static: true,
  },
});
