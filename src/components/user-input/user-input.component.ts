import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../../app/services/api.service';
import { UserDetailsInterface } from '../../app/utils/interface';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
HttpClient;
@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent {
  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) {}

  userDetails: UserDetailsInterface | null = null;

  username: string = '';
  isSubmitDisabled: boolean = true;
  isLoading: boolean = false;

  onInputChange() {
    this.isSubmitDisabled = !this.username || !this.username.trim();
    console.log('this.isSubmitDisabled', this.isSubmitDisabled);
  }

  findUser() {
    this.isLoading = true;
    console.log('this.username', this.username);
    this.apiService
      .getUser(this.username.trim())
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError('User not found');
          } else {
            return throwError('Something went wrong');
          }
        })
      )
      .subscribe((user: UserDetailsInterface) => {
        console.log('user', user);
        this.dataService.setUserDetails(user);
        this.isLoading = false;
      });
  }
}
