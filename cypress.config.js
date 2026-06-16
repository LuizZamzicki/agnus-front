import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",

    env: {
      apiUrl: "http://localhost:5000",
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});