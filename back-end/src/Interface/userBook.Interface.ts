// Precisa bater exatamente com o ENUM da coluna `status` em user_book (banco.sql)
export type BookStatus = | 'Quero ler' | 'Lendo' | 'Lidos' | 'Gostei' | 'Não Gostei'


export interface UserBook {
    id: number;
    user_id: number;
    book_id: number;
    status: BookStatus;
    rating: number | null;
}