export type Reaction = | `like` | `dislike` | `skip`

export interface Swapping {
    id: number;
    swapping_id: number;
    book_id: number;
    action: Reaction;
}