export type BookStatus = | 'Quero Ler' | 'Lendo' | 'Lidos' | 'Gostei' | 'Não Gostei'


export interface UserBook {
    id: number;
    user_id: number;
    book_id: number;
    status: BookStatus;
}