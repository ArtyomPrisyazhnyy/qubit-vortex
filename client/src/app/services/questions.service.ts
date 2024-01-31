import { Observable, retry, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPostQuestion, IOneQuestion, IQuestions, IPostQuestionRes } from '../types/question.interface'
import { API_URL } from '../../environments/environments';
import { IAnswer, IAnswerRes } from '../types/answer.interface';
import { OrderCriteria } from '../types/orderCriteria.enum';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    constructor(
        private readonly http: HttpClient,
    ){}

    limits: string[] = ['15', '30', '50'];
    activeLimit: string = '15';

    currentPage: number = 1;
    searchQustion: string = '';

    formattedQuestionCount: string = '0';

    Criteria: OrderCriteria = OrderCriteria.Newest;

    questions: IQuestions = {count: 0, rows: []}
    oneQuestion: IOneQuestion = {
        id: 0,
        title: '',
        fullDescription: '',
        views: 0,
        image: '',
        gptAnswer: null,
        userId: 0,
        createdAt: '',
        updatedAt: '',
        user: {
          id: 0,
          nickname: '',
          avatar: '',
        },
        answer: [],
        tags: []
    };

    getAll(
        limit: string, 
        page: string, 
        searchQuestion: string, 
        orderCriteria: OrderCriteria
    ): Observable<IQuestions> {
        let params = new HttpParams()
            .set('limit', limit)
            .set('page', page)
            .set('orderCriteria', orderCriteria);

        // Добавляем необязательный query параметр, если он передан
        if (searchQuestion) {
            params = params.set('searchQuestion', searchQuestion);
        }

        return this.http.get<IQuestions>(`${API_URL}/question`, { params })
            .pipe(
                retry(2),
                tap(questions => this.questions = questions),
                tap(questions => this.formatQuestionCount(questions.count))
                
            )
    }

    updateCurrentPage(page: number): void {
        this.currentPage = page;
    }

    updateActiveLimit(limit: string): void {
        this.activeLimit = limit
    }

    setSerchQuestion(question: string): void {
        this.searchQustion = question
    }

    getOneQuestion(id: string): Observable<IOneQuestion>{
        return this.http.get<IOneQuestion>(`${API_URL}/question/${id}`)
            .pipe(
                retry(2),
                tap(oneQuestion => this.oneQuestion = oneQuestion)
            )
    }

    createQuestion(question: IPostQuestion): Observable<IPostQuestionRes>{
        return this.http.post<IPostQuestionRes>(`${API_URL}/question`, question);
    }

    deleteOneQuestion(id: string){
        return this.http.delete(`${API_URL}/question/${id}`);
    }

    increaseViews(id: string) {
        return this.http.put(`${API_URL}/question/views`, { id });
    }

    createAnswer(answer: IAnswer, questionId: string): Observable<IAnswerRes>{
        return this.http.post<IAnswerRes>(`${API_URL}/answer/${questionId}`, answer);
    }

    deleteOneAnswer(id: string){
        return this.http.delete(`${API_URL}/answer/${id}`);
    }

    formatQuestionCount(count: number): void {
        this.formattedQuestionCount = new Intl.NumberFormat('en').format(count);
    }

    updateCriteria(criteria: OrderCriteria): void {
        this.Criteria = criteria
    }

}