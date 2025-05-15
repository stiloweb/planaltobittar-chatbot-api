import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    DB_HOST: z.string().min(1),
    DB_PORT: z.string().transform((val) => parseInt(val, 10)),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_DATABASE: z.string().min(1),
})

export const env = envSchema.parse(process.env)
