import { Request } from 'express';
import { User } from '../user/user.entity';

interface ReqWithUser extends Request {
  user: User;
  cookies: Request.cookies;
}

export default ReqWithUser;
