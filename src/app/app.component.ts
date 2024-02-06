import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  title = 'fyle-frontend-challenge';
  ngOnInit() {
    // this.apiService.getUser('johnpapa').subscribe(console.log);
  }
}
