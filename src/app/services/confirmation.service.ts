import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new Subject<void>();

  confirmation$ = this.confirmationSubject.asObservable();

  showConfirmation(): void {
    this.confirmationSubject.next();
  }
}
