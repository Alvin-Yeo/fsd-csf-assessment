import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class HttpQueryService {

    supportedCoutryCodes = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za';
    supportedCoutryCodesParam = this.supportedCoutryCodes.replace(/ /g, ";");

    constructor(private http: HttpClient) {
    }

    async getCountryList(): Promise<any> {
        console.log('Calling api to retrive country list...');
        return await this.http.get(`https://restcountries.eu/rest/v2/alpha?codes=${this.supportedCoutryCodesParam}`).toPromise();
    }

    async getNews(cc: string, apikey: string): Promise<any> {
        const url = `https://newsapi.org/v2/top-headlines?country=${cc}&category=general&pageSize=30`;
        console.log('Calling api to retrive news list...');
        try {
            return await this.http.get(url, { headers: { 'x-api-key': apikey } }).toPromise();
        } catch(e) {
            console.log('Http request failed: ', e);
        }
    }
}