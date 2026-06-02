export class MovieMapper {
    public static toMovie(entity: any) {
        if(!entity.releaseDate.getTime()) return entity
        
        const ms = entity.releaseDate.getTime()

        return {
            ...entity,
            releaseDate: {
                seconds: Math.floor(ms / 1000),
                nanos: (ms % 1000) * 1_000_000
            }
        }
    }
}