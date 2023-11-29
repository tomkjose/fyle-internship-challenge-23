import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDetailsInterface } from '../../app/utils/interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}
  private userDetailsSubject = new BehaviorSubject<UserDetailsInterface | null>(
    null
  );
  public userDetails$ = this.userDetailsSubject.asObservable();

  setUserDetails(userDetails: UserDetailsInterface | null) {
    this.userDetailsSubject.next(userDetails);
  }
}
