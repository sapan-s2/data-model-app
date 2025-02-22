import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private schemaSubject = new BehaviorSubject<any>(null);
  schema$ = this.schemaSubject.asObservable();

  updateSchema(schema: any) {
    this.schemaSubject.next(schema);
  }
}
