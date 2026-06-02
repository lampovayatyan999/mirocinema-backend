
export interface Movie {
    id: string
    title: string
    slug: string
    banner: string
    duration: number
}

export abstract class MoviePort {
    public abstract findById(id: string): Promise<Movie | null>
}