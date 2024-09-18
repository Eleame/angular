import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const objects = [
      { id: 1, name: 'Object 1', value: 100 },
      { id: 2, name: 'Object 2', value: 200 },
      { id: 3, name: 'Object 3', value: 300 },
      { id: 4, name: 'Object 4', value: 400 },
      { id: 5, name: 'Object 5', value: 500 },
      { id: 6, name: 'Object 6', value: 600 },
      { id: 7, name: 'Object 7', value: 700 },
    ];
    return { objects };
  }
}
