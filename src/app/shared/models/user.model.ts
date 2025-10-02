export interface UserModel {
    id: string;
    is_active: boolean;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginModel {
    email: string;
    password: string;
}

export interface SignupModel extends LoginModel {
    name: string;
}

export interface AuthResponse {
  user: UserModel;
  access_token: string;
  refresh_token: string;
}