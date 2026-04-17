import { User } from "../Interface/user.Interface";

export type CreateUserDTO = Pick<User, `CPF` | `email` | `password` | `username`>
export type UpdateUserDTO = Partial<CreateUserDTO> & {
    theme_status?: 'Modo claro' | 'Modo escuro';
};