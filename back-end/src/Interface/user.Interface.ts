export interface User {
    id: number;
    username: string;
    email: string;
    CPF: number;
    password: string;
    theme_status: 'Modo claro' | 'Modo escuro';
    is_admin: boolean;
    create_at: Date;
}