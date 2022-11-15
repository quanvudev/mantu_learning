declare namespace API {
  interface WithSuccessData<D> {
    data: D;
    status: boolean;
  }

  export interface User {
    id: number;
    authId: number;
    name: string;
  }

  export interface LoginPayload {
    username: string;
    password: string;
  }

  export interface UserWithToken {
    accessToken: string;
    data: User;
  }

  export interface AUTH {
    getUser: (token?: string) => Promise<WithSuccessData<User>>;
    login: (payload: LoginPayload) => Promise<UserWithToken>;
  }
}
