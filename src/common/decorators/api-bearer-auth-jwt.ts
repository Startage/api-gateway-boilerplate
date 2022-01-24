import { ApiBearerAuth } from '@nestjs/swagger';

export const ApiBearerAuthJwt = () => ApiBearerAuth('JWT');
