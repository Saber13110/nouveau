import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTrackingComponent } from './components/all-tracking/all-tracking.component';
import { TrackingResultComponent } from './components/tracking-result/tracking-result.component';

const routes: Routes = [
  {
    path: '',
    component: AllTrackingComponent
  },
  {
    path: 'result',
    component: TrackingResultComponent
  },
  {
    path: ':id',
    component: TrackingResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { } 