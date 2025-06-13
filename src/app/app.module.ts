import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './pages/help/help.component';
import { TrackingAdviceComponent } from './pages/help/tracking-advice/tracking-advice.component';
import { TrackingToolsComponent } from './pages/help/tracking-tools/tracking-tools.component';
import { FaqsComponent } from './pages/help/faqs/faqs.component';
import { ContactUsComponent } from './pages/help/contact-us/contact-us.component';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    TrackingAdviceComponent,
    TrackingToolsComponent,
    FaqsComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { } 