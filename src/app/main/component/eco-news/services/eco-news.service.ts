import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { EcoNewsModel } from '../models/eco-news-model';
import { environment } from '@environment/environment';
import { EcoNewsDto } from '../models/eco-news-dto';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EcoNewsService implements OnDestroy {
  private backEnd = environment.backendLink;
  private language: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((language) => (this.language = language));
  }

  getEcoNewsListByPage(page: number, quantity: number) {
    return this.http.get(`${this.backEnd}econews?page=${page}&size=${quantity}`);
  }

  getEcoNewsListByAutorId(page: number, quantity: number) {
    return this.http.get(`${this.backEnd}econews/byUserPage?page=${page}&size=${quantity}`);
  }

  getNewsListByTags(page: number, quantity: number, tags: Array<string>) {
    return this.http.get(`${this.backEnd}econews/tags?page=${page}&size=${quantity}&tags=${tags}`);
  }

  getNewsList(): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    return new Observable((observer: Observer<any>) => {
      this.http
        .get<EcoNewsDto>(`${this.backEnd}econews`)
        .pipe(take(1))
        .subscribe((newsDto: EcoNewsDto) => {
          observer.next(newsDto);
        });
    });
  }

  getEcoNewsById(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}?lang=${this.language}`);
  }

  getRecommendedNews(id: number): Observable<EcoNewsModel[]> {
    return this.http.get<EcoNewsModel[]>(`${this.backEnd}econews/recommended?openedEcoNewsId=${id}`);
  }

  getIsLikedByUser(econewsId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.backEnd}econews/isLikedByUser`, { params: { econewsId } });
  }

  postToggleLike(id: number): Observable<any> {
    return this.http.post(`${this.backEnd}econews/like?id=${id}`, {});
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}econews/${id}`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
