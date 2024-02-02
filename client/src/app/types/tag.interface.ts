export interface IRow {
    id: number;
    tag: string;
    description: string;
    questionCount: number;
    todayQuestionCount: number;
    lastWeekQuestionCount: number;
    lastMonthQuestionCount: number;
}

export interface ITag {
    count: number;
    rows: IRow[]
}
