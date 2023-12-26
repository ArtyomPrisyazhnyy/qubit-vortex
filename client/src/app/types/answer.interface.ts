export interface IAnswer{
    answer: string;
    image: string | null;
}

export interface IAnswerRes{
    id: number,
    answer: string;
    image: string | null;
    userId: number;
    questionId: number
}