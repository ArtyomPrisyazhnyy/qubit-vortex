export interface IAuthRegistrationUser {
    nickname: string;
    email: string
    password: string;
}

export interface IAuthLoginUser {
    email: string;
    password: string;
}

export interface IToken {
    token: string;
}

export interface UserRole {
    id: number;
    value: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    UserRoles: {
      id: number;
      roleId: number;
      userId: number;
    };
  }
  

export interface IUserFromToken {
    email: string;
    id: number;
    roles: UserRole[];
    iat: number;
    exp: number;
}

export interface IUSersPage{
    id: number,
    nickname: string;
    avatar: string | null;
    country: string | null;
    isPrivate: boolean,
    isFriend: boolean,
    isRequestSender: boolean,
    areYouSender: boolean
}