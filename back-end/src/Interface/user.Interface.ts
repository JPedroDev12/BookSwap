export interface User {
    id: number;
    username: string;
    email: string;
    CPF: number;
    password: string;
    theme_status: 'Modo claro' | 'Modo escuro';
    create_at: Date;
}