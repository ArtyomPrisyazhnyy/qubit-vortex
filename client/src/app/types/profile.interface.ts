export interface IProfile {
    id?: number;
    nickname: string;
    country: string | null;
    aboutMe: string | null;
    links: string | null;
    avatar: string | null;
}