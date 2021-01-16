export type siteName = 'melon' | 'genie' | 'bugs';

export interface ChartData {
    rank : number
    title : string
    artist : string
    album : string
    score? : number
}

declare global {
    namespace Express {
        interface User {
            id: string | number
        }
    }
}