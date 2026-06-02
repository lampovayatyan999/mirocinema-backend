export const MovieCacheKeys = {
    all: (params: {category?: string, random?: boolean, limit?: number}) => 
    [
        'movies', 'list', 
        params.category ?? 'all', 
        params.random ? 'random' : 'ordered',
        params.limit ?? 'nolimit'
    ].join(':') ,
    bySlug: (slug: string) => `movies:slug:${slug}`,
    byId: (id: string) => `movies:id:${id}`
}

