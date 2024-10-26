interface ImportMetaEnv {
  readonly VITE_EXAMPLE_CLIENT_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly SESSION_SECRET: string;
    readonly DB_LOCATION: string;
  }
}
