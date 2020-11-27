import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NewsApiComponent } from './components/news-api.component';
import { CountryListComponent } from './components/country-list.component';
import { NewsPageComponent } from './components/news-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main.component';
import { NewsDatabase } from './news.database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpQueryService } from './http-query.service';

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'apikey', component: NewsApiComponent },
  { path: 'country', component: CountryListComponent },
  { path: 'country/:cc', component: NewsPageComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NewsApiComponent,
    CountryListComponent,
    NewsPageComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [
    NewsDatabase,
    HttpQueryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
