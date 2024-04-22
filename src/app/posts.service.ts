import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentUrl } from '../constant';
import { IResponseData } from './post.model';
import { Subject, catchError, map, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}
  createAndStorePost(title: string, content: string) {
    // Send Http request
    const postData: IResponseData = { title: title, content: content };
    console.log(postData);
    this.http
      .post<{ name: string }>(environmentUrl, postData, {
        observe: 'response',
      })
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
  fetchPost() {
    let serachParam = new HttpParams();
    serachParam = serachParam.append('print', 'pretty');
    serachParam = serachParam.append('ids', 'newValue');
    return this.http
      .get<{ [key: string]: IResponseData }>(environmentUrl, {
        headers: new HttpHeaders({ 'custom-header': 'Hello' }),
        params: serachParam,
        responseType: 'json',
      })
      .pipe(
        map((responseData) => {
          const postArray: IResponseData[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          //send to Analytics serve
          return throwError(() => errorRes);
        })
      );
  }
  deletePostData() {
    return this.http
      .delete(environmentUrl, {
        observe: 'events',
        responseType: 'text',
      })
      .pipe(
        tap((event) => {
          console.log(event);

          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
