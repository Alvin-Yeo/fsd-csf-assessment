import { Component, OnInit } from '@angular/core';
import { HttpQueryService } from '../http-query.service';
import { Country } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  countryList: Country[];

  constructor(
    private db: NewsDatabase,
    private http: HttpQueryService
  ) { }

  ngOnInit(): void {
    this.checkCountryList();
  }

  async checkCountryList() {
    const list = await this.db.getCountryList();

    if(list.length > 0) {
      console.log('Country list found in database.');
      this.countryList = list;
    }
    else {
      console.log('Country list not found.');
      const results = await this.http.getCountryList();
     
      this.countryList = results.map(cc => {
        return {
          cc: cc.alpha2Code,
          name: cc.name,
          flagUrl: cc.flag
        }
      });
      // console.log(this.countryList);

      await this.saveCountryList(this.countryList);
    }
  }

  async saveCountryList(list: Country[]): Promise<any> {
    await this.db.saveCountryList(list);
  }
}
