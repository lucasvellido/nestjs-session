import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import expressSession, * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

const ENV = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      rolling: false,
      name: 'NEST_SESSION',
      secret: 'CHANGE_TO_STRONG_HASH',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(ENV.COOKIE_SESSION_EXPIRATION_TIME),
        httpOnly: true,
        sameSite: true,
        secure: ENV.NODE_ENV === 'production',
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 5 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
