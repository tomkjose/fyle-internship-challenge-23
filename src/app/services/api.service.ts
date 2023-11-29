import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoDetailsInterface } from '../utils/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: String) {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}`
    );
  }

  getRepos(githubUsername: String, page: Number, limit: Number) {
    return this.httpClient.get<RepoDetailsInterface[] | null>(
      `https://api.github.com/users/${githubUsername}/repos?per_page=${limit}&page=${page}`
    );
  }

  getLanguages(url: String | any) {
    return this.httpClient.get(`${url}/languages`);
  }
}
