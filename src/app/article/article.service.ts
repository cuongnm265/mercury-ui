import { Injectable } from '@angular/core';
import { Article } from './article';
import { Comment } from '../comment';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { SocketIOService } from "../socket.io/socket-io.service";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ArticleService {

  private apiUrl: string = process.env.apiUrl;

  constructor(private http: Http, private socketIOService: SocketIOService) { }

  getRecommendedArticles(userId): Promise<Article[]> {
    return this.http.get(this.apiUrl + 'articles/users/' + userId + '/suggestions').toPromise().then(res => res.json()).catch(this.handleError);
  }
  // get articles of selected category
  getArticles(name: string): Promise<Article[]> {
    let articleUrl: string;
    if (name === undefined || name == 'all' || name == '') {
      articleUrl = this.apiUrl + 'articles';
    } else {
      articleUrl = this.apiUrl + 'categories/' + name + '/articles';
    }
    return this.http.get(articleUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // get article detail by articleID
  getArticleDetail(id: string): Promise<Article> {
    if (id === undefined) {
      return null;
    } else {
      let requestURL = this.apiUrl + 'articles' + '/' + id;
      return this.http.get(requestURL).toPromise().then(response => response.json()).catch(this.handleError);
    }
  }


  postArticle(article: Article) {
    let body = JSON.stringify(article);
    let userToken = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', userToken);
    return this.http.post(this.apiUrl + 'articles', body, { headers: headers })
      .toPromise().then(response => response).catch(this.handleError);
  }


  putArticle(article: Article) {
    let body = JSON.stringify(article);
    let userToken = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', userToken);
    return this.http.put(this.apiUrl + 'articles/' + article._id, body, { headers: headers })
      .toPromise().then(response => response).catch(this.handleError);
  }

  deleteArticle(articleId: String) {
    let article = { '_id': articleId };
    let body = JSON.stringify(article);
    let userToken = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', userToken);
    return this.http.delete(this.apiUrl + 'articles/' + articleId, new RequestOptions({
      headers: headers,
      body: body
    })).toPromise().then(response => response).catch(this.handleError);
  }

  getComments(id: string): Promise<any> {
    let url = this.apiUrl + 'articles' + '/' + id + '/comments';
    return this.http.get(url).toPromise().then(response => response.json()).catch(this.handleError);
  }

  postComment(id: string, comment: Comment) {
    let body = JSON.stringify(comment);
    let header = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + 'articles' + '/' + id + '/comments', body, { headers: header }).toPromise().then(response => {
    }).catch(this.handleError);
  }

  putComment(id: string, comment: Comment) {
    let body = JSON.stringify(comment);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl + 'articles' + '/' + id + '/comments' + '/' + comment._id, body, { headers: headers }).toPromise().then(response => response);
  }

  removeComment(articleId: string, commentId: string) {
    return this.http.delete(this.apiUrl + 'articles' + '/' + articleId + '/comments' + '/' + commentId).toPromise().then(response => response).catch(this.handleError);
  }

  getParticipants(articleId: string) {
    return this.http.get(this.apiUrl + 'articles' + '/' + articleId + '/participants').toPromise().then(res => res.json()).catch(this.handleError);
  }

  mentionParticipants(articleId: string, userId: string, participantsId: any[]) {
    let header = new Headers({ 'Content-Type': 'application/json' });
    for (let mentionedParticipantId of participantsId) {
      let notification = {
        type: 'mentioned',
        article_id: articleId,
        sender: userId,
        recipient: mentionedParticipantId
      }
      this.http.post(this.apiUrl + 'notifications/pushNotification', notification, { headers: header })
        .toPromise().then(response => {
          this.socketIOService.pushNotificationToUsers(participantsId);
        }).catch(this.handleError);
    }
  }

  getTags(): Promise<any> {
    let url = this.apiUrl + 'articles/tags';
    return this.http.get(url).toPromise().then(response => response.json()).catch(this.handleError);
  }


  getTrendingLatestArticles(categoryId: string, isLatest: boolean): Promise<Article[]> {
    let url = '';
    if (isLatest == true) {
      url = this.apiUrl + 'categories/' + categoryId + '/articles/latest';
    } else {
      url = this.apiUrl + 'categories/' + categoryId + '/articles/trending';
    }
    return this.http.get(url).toPromise().then(response => response.json()).catch(this.handleError);
  }

  getSearchedArticles(query: string): Promise<any> {
    let url = this.apiUrl + "articles/search";
    let requestOptions = new RequestOptions();
    let params: URLSearchParams = new URLSearchParams();
    params.set('q', query);
    requestOptions.params = params;
    return this.http.get(url, requestOptions).toPromise().then(response => response.json()).catch(this.handleError);
  }

  getAWSKey(): Promise<any> {
    let url = this.apiUrl + "technical/keys/aws";
    let userToken = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', userToken);
    return this.http.get(url, {headers: headers}).toPromise().then(res => res.json()).catch(this.handleError);
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
        if (distance_minutes <= 1) {
          message = 'just now';
        }
        else {
          message = distance_minutes + ' minutes ago';
        }
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
