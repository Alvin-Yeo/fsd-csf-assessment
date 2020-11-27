import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpQueryService } from '../http-query.service';
import { cachedNewsList, News } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css']
})
export class NewsPageComponent implements OnInit {

  cc: string;
  country: string;
  apikey: string;

  latestNewsList: News[];
  lastCachedTime: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: NewsDatabase,
    private http: HttpQueryService
  ) { }

  ngOnInit(): void {
    this.cc = this.activatedRoute.snapshot.params['cc'];
    this.getCountryName();
    this.checkNewsList();
  }

  async getCountryName() {
    this.country = (await this.db.getCountryName(this.cc)).name;
  }

  async setApiKey() {
    this.apikey = (await this.db.getApiKey())[0].apikey;
  }

  async checkNewsList() {
    const list = await this.db.getNewsList(this.cc);
    
    if(list !== undefined && list.cachedList.news) {
      console.log('News list found in database.');
      this.lastCachedTime = list.cachedList.cachedTime;

      if(this.calculateTimeDiff(this.lastCachedTime) >= 5) {
        console.log('5 minutes has gone, calling api....');
        await this.getNewsListFromApi();
        await this.saveCachedNewsList(this.cc, this.latestNewsList);
      } else {
        console.log('Less than 5 minutes, get data from caches....');
        this.latestNewsList = list.cachedList.news;
      }
    } else {
      console.log('News list not found in database.');
      await this.getNewsListFromApi();
      await this.saveCachedNewsList(this.cc, this.latestNewsList);
    }
  }

  async getNewsListFromApi() {
    await this.setApiKey();
      
    const results = await this.http.getNews(this.cc, this.apikey);
    console.log('Results: ', results);

    if(results && results.articles.length > 0) {
      this.latestNewsList = results.articles.map(n => {
        return {
          source: n.source.name,
          author: n.author,
          title: n.title,
          desc: (n.description === null) ? '' : n.description,
          url: n.url,
          image: n.urlToImage,
          date: new Date(n.publishedAt),
          content: n.content
        }
      });

      this.lastCachedTime = new Date();
      console.log(this.lastCachedTime);
      console.log(this.latestNewsList);
    }
  }

  async saveCachedNewsList(cc: string, cachedList: News[]) {
    await this.db.saveNewsList(cc, {
      news: cachedList,
      cachedTime: this.lastCachedTime
    });
  }

  saveNews(index: number) {
    console.log('Saving news...');
    console.log(index);

    console.log('News saved successfully...');
  }

  calculateTimeDiff(lastCached: Date): number {
    const diffInMilliSeconds = (new Date()).getTime() - lastCached.getTime();
    const minutes = Math.floor(diffInMilliSeconds / 60000);
    console.log('minutes: ', minutes);
    return minutes;
  }
}
