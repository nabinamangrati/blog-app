import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

@Injectable()
export class PrismaService extends PrismaClient {}