export type User = {
    id: string
    email: string
    name: string
    lastLoggedIn: Date | null
    raw_password?: string
    created_at?: Date
    updated_at?: Date
}