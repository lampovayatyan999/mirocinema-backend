import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres' 
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { categories } from './drizzle/schema/category.schema'
import { movies } from './drizzle/schema/movies.schema'


dotenv.config()



export const CATEGORIES = [
  {
    title: 'Классика',
    slug: 'classic',
  },
  {
    title: 'Гоночные фильмы',
    slug: 'racing',
  },
  {
    title: 'Кино Балабанова',
    slug: 'balabanov',
  },
];

export const MOVIES = [
  {
    title: 'Крестный отец',
    slug: 'the-godfather',
    description:
      'Американская мафия. Сила семьи. Драма о том, как сын дона Корлеоне втягивается в мир, где правят честь и кровь.',
    poster: '/posters/the-godfather.webp',
    banner: '/banners/the-godfather.webp',
    duration: 175,
    releaseDate: null,
    releaseYear: 1972,
    ratingAge: 16,
    country: 'США',
    category: 'classic',
  },
  {
    title: 'Крестный отец 2',
    slug: 'the-godfather-2',
    description:
      'История семьи Корлеоне продолжается: параллельно — путь юного Вито и падение Майкла.',
    poster: '/posters/the-godfather-2.webp',
    banner: null,
    duration: 202,
    releaseDate: new Date('2025-12-31'),
    releaseYear: 1974,
    ratingAge: 16,
    country: 'США',
    category: 'classic',
  },
  {
    title: 'Форрест Гамп',
    slug: 'forrest-gump',
    description:
      'Простой парень с чистой душой проживает эпоху перемен и сам становится их частью. Невинность, любовь и великая американская история в одном сердце.',
    poster: '/posters/forrest-gump.webp',
    banner: '/banners/forrest-gump.webp',
    duration: 142,
    releaseDate: null,
    releaseYear: 1994,
    ratingAge: 18,
    country: 'США',
    category: 'classic',
  },
  {
    title: 'Побег из Шоушенка',
    slug: 'the-shawshank-redemption',
    description:
      'Банкир, несправедливо осуждённый, находит свободу — и надежду — в самых тёмных стенах. История о силе духа и долгом пути к свету.',
    poster: '/posters/the-shawshank-redemption.webp',
    banner: '/banners/the-shawshank-redemption.webp',
    duration: 142,
    releaseDate: null,
    releaseYear: 1994,
    ratingAge: 18,
    country: 'США',
    category: 'classic',
  },
  {
    title: 'Зелёная миля',
    slug: 'the-green-mile',
    description:
      'Тюрьма смертников, чудо посреди ужаса. История о сострадании, чудесах и боли, которую несут даже самые добрые сердца.',
    poster: '/posters/the-green-mile.webp',
    banner: '/banners/the-green-mile.webp',
    duration: 189,
    releaseDate: null,
    releaseYear: 1999,
    ratingAge: 16,
    country: 'США',
    category: 'classic',
  },
  // --- Новые объекты, добавленные для расширения сида ---
  {
    title: 'Брат',
    slug: 'brat',
    description:
      'Демобилизованный из армии Данила Багров отправляется в Петербург, где его старший брат успешно строит карьеру наемного убийцы.',
    poster: '/posters/brat.webp',
    banner: '/banners/brat.webp',
    duration: 100,
    releaseDate: null,
    releaseYear: 1997,
    ratingAge: 16,
    country: 'Россия',
    category: 'balabanov',
  },
  {
    title: 'Форсаж',
    slug: 'the-fast-and-the-furious',
    description:
      'Коп под прикрытием внедряется в банду уличных гонщиков, подозреваемых в налетах на грузовики, но ночная романтика и скорость меняют его планы.',
    poster: '/posters/the-fast-and-the-furious.webp',
    banner: null,
    duration: 106,
    releaseDate: null,
    releaseYear: 2001,
    ratingAge: 16,
    country: 'США',
    category: 'racing',
  },
  {
    title: 'Интерстеллар',
    slug: 'interstellar',
    description:
      'Группа исследователей отправляется в путешествие сквозь черную дыру, чтобы найти планету с подходящими условиями для угасающего человечества.',
    poster: '/posters/interstellar.webp',
    banner: '/banners/interstellar.webp',
    duration: 169,
    releaseDate: null,
    releaseYear: 2014,
    ratingAge: 12,
    country: 'США',
    category: 'classic',
  }
];



const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

async function main() {
    const client = await pool.connect()

    const db = drizzle(client) 

    console.log('Seeding categories...')

    await db.insert(categories).values([...CATEGORIES]).onConflictDoNothing()

    const dbCategories = await db.select().from(categories)

    const categoriesMap = new Map(dbCategories.map(c => [c.slug, c.id]))

    console.log('Seeding movies...')

    await db.insert(movies).values(MOVIES.map(movie => ({...movie, categoryId: movie.category ? (categoriesMap.get(movie.category) ?? null) : null}))).onConflictDoNothing()

    console.log('Seed completed!')

    client.release()
    process.exit(0)
}

main()