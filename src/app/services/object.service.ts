import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectModel } from '../models/object.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private apiUrl = 'api/objects';

  constructor(private http: HttpClient) {}

  getObjects(): Observable<ObjectModel[]> {
    return this.http.get<ObjectModel[]>(this.apiUrl);
  }

  getObject(id: number): Observable<ObjectModel> {
    return this.http.get<ObjectModel>(`${this.apiUrl}/${id}`);
  }

  addObject(object: ObjectModel): Observable<ObjectModel> {
    return this.http.post<ObjectModel>(this.apiUrl, object);
  }

  deleteObject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateObject(object: ObjectModel): Observable<ObjectModel> {
    return this.http.put<ObjectModel>(`${this.apiUrl}/${object.id}`, object);
  }
}
