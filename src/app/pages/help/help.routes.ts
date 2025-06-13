import { Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { TrackingAdviceComponent } from './tracking-advice/tracking-advice.component';
import { TrackingToolsComponent } from './tracking-tools/tracking-tools.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const HELP_ROUTES: Routes = [
  {
    path: '',
    component: HelpComponent,
    children: [
      {
        path: '',
        redirectTo: 'advice',
        pathMatch: 'full'
      },
      {
        path: 'advice',
        component: TrackingAdviceComponent
      },
      {
        path: 'tools',
        component: TrackingToolsComponent
      },
      {
        path: 'faq',
        component: FaqsComponent
      },
      {
        path: 'contact',
        component: ContactUsComponent
      }
    ]
  }
]; 