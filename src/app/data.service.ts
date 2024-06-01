// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = new Map<number, Observable<any>>();

  constructor(private http: HttpClient) {}

  fetchData(id: number): Observable<any> {
    if (!this.cache.has(id)) {
      const data$ = this.http.get<any>(`http://localhost:3000/data-energy/${id}`).pipe(
        map(data => this.transformData(data)),
        catchError(error => {
          console.error('Error fetching data from backend', error);
          return of(null);
        }),
        shareReplay(1)
      );
      this.cache.set(id, data$);
    }
    return this.http.get<any>(`http://localhost:3000/data-energy/${id}`);
  }

  private transformData(data: any): any {
    return data;
  }
}
