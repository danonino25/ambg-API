import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { Injectable, OnModuleInit } from '@nestjs/common';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
        });
        super({});
    }

    async onModuleInit() {
        await this.$connect();
    }
}