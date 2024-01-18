import { Observable, retry, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPostQuestion, IOneQuestion, IQuestions, IPostQuestionRes } from '../types/question.interface'
import { API_URL } from '../../environments/environments';
import { IAnswer, IAnswerRes } from '../types/answer.interface';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    constructor(
        private readonly http: HttpClient,
    ){}

    questions: IQuestions = {count: 0, rows: []}
    oneQuestion: IOneQuestion = {
        id: 0,
        title: '',
        fullDescription: '',
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
      };

    getAll(): Observable<IQuestions>{
        return this.http.get<IQuestions>(`${API_URL}/question`, 
        {
            params: new HttpParams({
                fromObject: {limit: 15}
            })
        }
        ).pipe(
            retry(2),
            tap(questions => this.questions = questions)
        )
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

    createAnswer(answer: IAnswer, questionId: string): Observable<IAnswerRes>{
        return this.http.post<IAnswerRes>(`${API_URL}/answer/${questionId}`, answer);
    }

    deleteOneAnswer(id: string){
        return this.http.delete(`${API_URL}/answer/${id}`);
    }

}