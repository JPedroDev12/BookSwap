export interface Book {
    id: number;
    user_id: number;
    title: string;
    author: string;
    isbn: number;
    cover_url: string;
    description: string;
    genre: string;
    year_published: number;
    price: number;
    listed_in_store: boolean;
    created_at: Date;
}