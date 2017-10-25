import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';
import { BadRequestError } from '../common/bad-request-error';

@Injectable()
export class DataService {

  constructor(private http: Http, private url: string) { }

  getAll() {
    return this.http.get(this.url)
      .map(resp => resp.json())
      .catch(this.handleError);
  }

  create(resource) {
    return this.http.post(this.url, JSON.stringify(resource))
      .map(resp => resp.json())
      .catch(this.handleError);
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({ isRead: true }))
      .map(resp => resp.json())
      .catch(this.handleError);
  }

  delete(id) {
    return this.http.delete(this.url + '/' + id)
      .map(resp => resp.json())
      .catch(this.handleError);
  }

  private handleError(err: Response) {

    if (err.status === 400) {
      return Observable.throw(new BadRequestError(err.json()));
    }

    if (err.status === 404) {
      return Observable.throw(new NotFoundError());
    }

    return Observable.throw(new AppError(err));

  }
}
