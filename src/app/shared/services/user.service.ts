import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import User from '../models/user.model';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'api/users'; // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`api/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions);
  }

  updateUser(user: User, id: number): Observable<User> {
    user.id = id;
    return this.http.put<User>(this.usersUrl, user, this.httpOptions);
  }
}
