declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string
        DIRECT_URL: string
        PORT: number
        TELEGRAM_TOKEN: string
    }
}
