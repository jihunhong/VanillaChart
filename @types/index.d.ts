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

declare namespace NodeJS {
    interface Process {
      /** running on server */
      isServer: boolean
    }
    interface ProcessEnv {
      /** node environment */
      NODE_ENV: string
      SESSION_SECRET : string
    }
  }