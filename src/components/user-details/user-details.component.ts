import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {
  RepoDetailsInterface,
  UserDetailsInterface,
} from 'src/app/utils/interface';
import { catchError } from 'rxjs/operators';
import { throwError, forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from '../../app/services/toast.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  limit: number = 6;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  userDetails: UserDetailsInterface | null = null;
  repoDetails: RepoDetailsInterface[] | null = [];
  pagesToShow: number[] = [];
  isLoading: boolean = false;
  userNotFound: boolean = false;
  copyMessage: string = '';

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dataService.userNotFound$.subscribe((value) => {
      this.userNotFound = value;
    });

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
      this.fetchRepoDetails();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchRepoDetails();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.fetchRepoDetails();
    }
  }

  copyToClipboard(): void {
    if (this.userDetails && this.userDetails.html_url) {
      const el = document.createElement('textarea');
      el.value = this.userDetails.html_url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      this.copyMessage = 'Copied!';
      this.toastService.showToast(this.copyMessage);

      setTimeout(() => {
        this.copyMessage = '';
      }, 2000);
    }
  }

  private handleRateLimitError(error: HttpErrorResponse): void {
    if (error.status === 403) {
      console.error('Rate limit exceeded');
    } else if (error.status === 404) {
      console.error('User repository not found');
    } else {
      console.error('Something went wrong');
    }
    this.isLoading = false;
  }

  private fetchRepoDetails(): void {
    this.isLoading = true;
    if (this.userDetails && this.userDetails.login) {
      this.apiService
        .getRepos(this.userDetails.login, this.currentPage, this.limit)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.handleRateLimitError(error);
            return of(null);
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
            this.isLoading = false;
          }
        });
    }
  }
}
