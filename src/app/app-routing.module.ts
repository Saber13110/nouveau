import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './pages/help/help.component';

const routes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: '/help', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 