import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {
  RepoDetailsInterface,
  UserDetailsInterface,
} from 'src/app/utils/interface';
import { catchError, flatMap } from 'rxjs/operators';
import { throwError, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  limit: number = 6;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  userDetails: UserDetailsInterface | null = null;
  repoDetails: RepoDetailsInterface[] | null = [];
  pagesToShow: number[] = [];
  isLoading: boolean = false;
  userNotFound: boolean = false;
  ngOnInit(): void {
    this.dataService.userNotFound$.subscribe((value) => {
      this.userNotFound = value;
    });
    // console.log('this.userNotFound', this.userNotFound);
    this.dataService.userDetails$.subscribe(
      (userDetails: UserDetailsInterface | null) => {
        this.userDetails = userDetails;

        if (userDetails && userDetails.login && userDetails.public_repos) {
          this.totalPages = Math.ceil(
            Number(userDetails.public_repos) / this.limit
          );
          this.generatePageNumbers();
          this.fetchRepoDetails();
        }
      }
    );
  }

  generatePageNumbers(): void {
    const pageOffset = 5;

    if (this.totalPages <= 10) {
      this.pagesToShow = Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );
    } else {
      let startPage = Math.max(1, this.currentPage - pageOffset);
      const endPage = Math.min(this.totalPages, this.currentPage + pageOffset);

      if (endPage - startPage + 1 < 10) {
        startPage = Math.max(1, endPage - 9);
      }

      this.pagesToShow = Array.from(
        { length: Math.min(10, this.totalPages) },
        (_, i) => startPage + i
      );
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.generatePageNumbers();
      // if (page > 9) {
      //   this.pagesToShow = Array.from({ length: page + 10 }, (_, i) => i + 10);
      // }
      console.log('this.currentPage in pageno', this.currentPage);
      this.fetchRepoDetails();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('this.currentPage in previouspage', this.currentPage);
      this.fetchRepoDetails();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      console.log('this.currentPage in nextpage', this.currentPage);
      this.fetchRepoDetails();
    }
  }

  private fetchRepoDetails(): void {
    this.isLoading = true;
    if (this.userDetails && this.userDetails.login) {
      this.apiService
        .getRepos(this.userDetails.login, this.currentPage, this.limit)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              return throwError('User repository not found');
            } else {
              return throwError('Something went wrong');
            }
          })
        )
        .subscribe((userRepo: RepoDetailsInterface[] | null) => {
          if (userRepo !== null) {
            this.repoDetails = userRepo;
            const languageRequests = userRepo.map(
              (stack: RepoDetailsInterface) =>
                this.apiService.getLanguages(stack.url)
            );

            forkJoin(languageRequests).subscribe((results: any[]) => {
              results.forEach((lang, index) => {
                const repoLanguages = Object.keys(lang);
                if (repoLanguages.length > 0 && this.repoDetails) {
                  this.repoDetails[index].languages = repoLanguages;
                }
                this.isLoading = false;
              });
            });
          } else {
            this.repoDetails = [];
          }
        });
    }
  }
}
