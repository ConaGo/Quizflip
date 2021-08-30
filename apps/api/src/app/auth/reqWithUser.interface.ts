import { Request } from 'express';
import { User } from '../user/entities/user.entity';

interface ReqWithUser extends Request {
  user: User;
  cookies: Request['cookies'];
}

export default ReqWithUser;
