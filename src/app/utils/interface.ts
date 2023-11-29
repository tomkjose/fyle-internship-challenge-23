export interface UserDetailsInterface {
  login?: String;
  name?: string;
  bio?: string;
  public_repos?: Number;
  location?: string;
  twitter_username?: string;
  html_url?: string;
  avatar_url?: string;
}

export interface RepoDetailsInterface {
  id?: number;
  description?: string;
  name?: string;
  url?: string;
  languages: string[];
}
