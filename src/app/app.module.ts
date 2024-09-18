import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'details/:id', component: DetailPageComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }),
    MainPageComponent,
    DetailPageComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
