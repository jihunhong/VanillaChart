export type siteName = 'melon' | 'genie' | 'bugs';

export interface ChartData {
    id?: number
    rank : number
    title : string
    artistName : string
    albumName : string
    score? : number
    image? : string
    matched?: boolean
    album_id?: string | number
}

export interface Track {
    track: string
    lead: boolean?
}

export interface AlbumData {
    albumName: string
    artistName: string
    tracks: Array<Track>
    releaseDate: string
}

export interface UserWithPWD {
    id?: number
    email : string
    nickname : string
    password? : string
}

declare global {
    namespace Express {
        interface User {
            id: string | number
        }
        interface Request {
            decoded : any
        }
    }
    namespace NodeJS {
      interface ProcessEnv {
        LOCAL_DB_ID : string
        LOCAL_DB_PASSWORD : string
        LOCAL_DB_HOST : string
        PRODUCTION_DB_ID : string
        PRODUCTION_DB_PASSWORD : string
        PRODUCTION_DB_HOST : string
        SECRET_KEY : string
        YOUTUBE_API_KEY : string
        GOOGLE_CLIENT_ID : string
        GOOGLE_SECRET : string
        GOOGLE_REDIRECT : string
        AWS_ACESS_KEY : string
        AWS_SECRET_KEY : string
        COOKIE_KEY: string
      }
    }
}