import { createParamDecorator } from '@nestjs/common';

const User = createParamDecorator((_, req) => {
  console.log(_, req);

  return req.user;
});

export default User;
