export interface IQuestions {
    count: number;
    rows: ApiRow[];
  }
  
interface ApiRow {
    id: number;
    title: string;
    fullDescription: string;
    views: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    answersCount: number;
    user: ApiUser;
    tags: TagRow[]
}

interface TagRow{
    id: number,
    tag: string
}

interface ApiUser {
    id: number;
    nickname: string;
    avatar: string | null;
}

export interface IOneQuestion {
    id: number;
    title: string;
    fullDescription: string;
    views: number;
    image: string | null;
    gptAnswer: string | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        nickname: string;
        avatar: string;
    };
    answer: any[]; 
    tags: TagRow[];
}

export interface IPostQuestion {
    title: string;
    fullDescription: string;
    image: string | null
}

export interface IPostQuestionRes {
    id: number;
    fullDescription: string;
    title: string;
    image: string | null;
    userId: number;
    updatedAt: string;
    createdAt: string;
    gptAnswer: string | null;
}
  