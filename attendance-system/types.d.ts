export interface User {
  name: string;
  email: string;
  token: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}
