import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://hip-muskox-65.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
