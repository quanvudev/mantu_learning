declare namespace API {
  interface BaseEntity {
    id: number;

    createdAt: string;
    updatedAt: string;
  }
  interface WithSuccessData<D> {
    data: D;
    status: boolean;
  }

  export interface User extends BaseEntity {
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

  export interface Note extends BaseEntity {
    content: string;
    user?: User;
    deletedAt?: string;
  }

  export interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }

  export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
  }

  export interface PaginationResponse<Item> {
    items: Item[];
    meta: Meta;
    links: Links;
  }

  export interface AUTH {
    getUser: (token?: string) => Promise<WithSuccessData<User>>;
    login: (payload: LoginPayload) => Promise<UserWithToken>;
  }

  export interface NOTE {
    getNotes: (
      limit?: number,
      page?: number
    ) => Promise<PaginationResponse<Note>>;
    getMyNotes: (
      limit?: number,
      page?: number
    ) => Promise<PaginationResponse<Note>>;
    createNote: (payload: string) => Promise<Note>;
    updateNote: (id: number, payload: string) => Promise<Note>;
    deleteNote: (id: number, hard?: boolean) => Promise<Note>;
    recoverNote: (id: number) => Promise<Note>;
  }
}

declare namespace namespace {
  export interface User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    authId: number;
    name: string;
  }

  export interface Item {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    user: User;
  }

  export interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }

  export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
  }

  export interface RootObject {
    items: Item[];
    meta: Meta;
    links: Links;
  }
}
