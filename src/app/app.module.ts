import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from 'src/pages/home/home.component';
import { FofComponent } from 'src/pages/fof/fof.component';
import { AppRoutingModule } from './app-routing.module';
import { UserDetailsComponent } from '../components/user-details/user-details.component';
import { UserInputComponent } from 'src/components/user-input/user-input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FofComponent,
    UserDetailsComponent,
    UserInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
