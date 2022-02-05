import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CorsConfig = (): CorsOptions => {
  return {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
  };
};
