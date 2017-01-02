import { Injectable } from '@angular/core';
import { Article } from './article';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ArticleService {

  private apiUrl: string = 'http://localhost:3000/api/';

  constructor(private http: Http) { }

  // get articles of selected category
  getArticles(categoryName: string): Promise<Article[]> {
    let articleUrl: string;
    if (categoryName === undefined) {
      articleUrl = this.apiUrl + 'all/articles';
    } else {
      articleUrl = this.apiUrl + categoryName + '/articles';
    }

    return this.http.get(articleUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // get article detail by articleID
  getArticleDetail(categoryName: string, articleID: number): Promise<Article> {

    if (articleID === undefined) {
      return null;
    } else {
      let requestURL = this.apiUrl + categoryName + '/' + articleID;
      return this.http.get(requestURL).toPromise().then(response => response.json()).catch(this.handleError);
    }
  }

  postArticle(article: Article) {
    let body = JSON.stringify(article);
    let header = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + 'all/articles/post', body, {headers: header})
        .toPromise().then(response => response).catch(this.handleError);
  }


  // Time Converting Methods ---------------------------- //
  getTimeDistance(Post_TimeStamp: string): string {
    // get current time - UTC format
    let currentTimestamp = new Date().getTime();
    let date_string = Post_TimeStamp;
    let date_converted = new Date(date_string).getTime();

    let distance = currentTimestamp - date_converted;

    let distance_dates = +this.toDate(distance);
    let distance_hours = +this.toHour(distance);
    let distance_minutes = +this.toMinutes(distance);

    let message: string = '';


    if (distance_dates < 1) {
      if (distance_hours < 1) {
        message = distance_minutes + ' minutes ago';
      }
      else {
        message = distance_hours + ' hours ago';
      }
    }
    else {
      message = distance_dates + ' days ago';
    }

    return message;
  }

  private toHour(time) {
    return (time / (1000 * 60 * 60)).toFixed(0);
  }

  private toDate(time) {
    return (time / (1000 * 60 * 60 * 24)).toFixed(0);
  }

  private toMinutes(time) {
    return (time / (1000 * 60)).toFixed(0);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
