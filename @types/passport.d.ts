import 'passport';

declare module 'passport' {
    export interface AuthenticateOptions {
        accessType?: string;
    }
}