// In your api.service.spec.ts file
import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { RepoDetailsInterface } from '../utils/interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user data', () => {
    const dummyUser = { login: 'johnpapa' };
    const githubUsername = 'johnpapa';

    service.getUser(githubUsername).subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${githubUsername}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should retrieve user repositories', () => {
    const dummyRepos: RepoDetailsInterface[] = [
      { name: 'repo1', languages: ['TypeScript', 'JavaScript'] },
      { name: 'repo2', languages: ['JavaScript', 'HTML'] },
    ];
    const githubUsername = 'johnpapa';
    const page = 1;
    const limit = 10;

    service.getRepos(githubUsername, page, limit).subscribe((repos) => {
      expect(repos).toEqual(dummyRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${githubUsername}/repos?per_page=${limit}&page=${page}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyRepos);
  });

  it('should retrieve languages for a repository', () => {
    const githubUsername = 'johnpapa';
    const dummyLanguages = { TypeScript: 100, JavaScript: 50 };
    const repoUrl = `https://api.github.com/repos/${githubUsername}/repo1`;

    service.getLanguages(repoUrl).subscribe((languages) => {
      expect(languages).toEqual(dummyLanguages);
    });

    const req = httpMock.expectOne(`${repoUrl}/languages`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLanguages);
  });
});
