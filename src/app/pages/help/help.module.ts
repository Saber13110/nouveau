import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HelpComponent } from './help.component';
import { TrackingAdviceComponent } from './tracking-advice/tracking-advice.component';
import { TrackingToolsComponent } from './tracking-tools/tracking-tools.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HELP_ROUTES } from './help.routes';

@NgModule({
  declarations: [
    HelpComponent,
    TrackingAdviceComponent,
    TrackingToolsComponent,
    FaqsComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(HELP_ROUTES)
  ]
})
export class HelpModule { } 