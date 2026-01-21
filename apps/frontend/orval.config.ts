import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  foodOrderingAppApi: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger/json`,
    },
    output: {
      client: "react-query",
      mode: "tags-split",
      target: "./src/generated/api.ts",
      schemas: "./src/generated/models.ts",
      override: {
        mutator: {
          path: "./src/lib/fetchClient.ts",
          name: "fetchClient",
        },
      },
    },
  },
});
