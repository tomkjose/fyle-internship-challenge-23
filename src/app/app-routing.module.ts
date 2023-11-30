import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FofComponent } from 'src/pages/fof/fof.component';
import { HomeComponent } from 'src/pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'not-found', component: FofComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
