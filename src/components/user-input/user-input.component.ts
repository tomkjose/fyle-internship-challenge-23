import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/services/api.service';
import { UserDetailsInterface } from '../../app/utils/interface';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) {}

  userDetails: UserDetailsInterface | null = null;

  username: string = 'johnpapa'; // Initial username
  isSubmitDisabled: boolean = true;
  isLoading: boolean = false;
  userNotFound: boolean = false;

  ngOnInit() {
    // Call findUser() initially with the default username
    this.findUser();
  }

  onInputChange() {
    this.isSubmitDisabled = !this.username || !this.username.trim();
  }

  findUser() {
    this.isLoading = true;
    // console.log('this.username', this.username);
    this.apiService
      .getUser(this.username.trim())
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            this.userNotFound = true;
            this.dataService.setUserNotFound(false);
            // console.log('userNotFound', this.userNotFound);
            return throwError('User not found');
          } else {
            return throwError('Something went wrong');
          }
        })
      )
      .subscribe(
        (user: UserDetailsInterface) => {
          this.userNotFound = false;
          // console.log('user', user);
          this.dataService.setUserNotFound(true);
          this.dataService.setUserDetails(user);

          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }
}
