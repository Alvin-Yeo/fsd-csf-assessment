import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Country, NewsCollection, cachedNewsList } from './models';

@Injectable()
export class NewsDatabase extends Dexie {

    private apikey: Dexie.Table<ApiKey, number>;
    private country: Dexie.Table<Country, string>;
    private news: Dexie.Table<NewsCollection, string>;
    
    constructor() {
        super('SimpleNewsDatabase');

        // Create schemas
        this.version(1).stores({
            apikey: 'id',
            country: 'cc',
            news: 'cc'
        })

        this.apikey = this.table('apikey');
        this.country = this.table('country');
        this.news = this.table('news');
    }

    async getApiKey(): Promise<ApiKey[]> {
        return await this.apikey.toArray();
    }

    async saveApiKey(key: string): Promise<any> {
        key = key.trim();

        // check exisitng records
        const count = (await this.getApiKey()).length;
        console.log('API key found in database. Please delete the existing API key before saving a new API Key.');

        if(count <= 0) {
            return await this.apikey.add({ apikey: key, id: 1 });
        }
    }

    async deleteApiKey(): Promise<any> {
        return await this.apikey.delete(1);
    }

    async getCountryList(): Promise<Country[]> {
        return await this.country.toArray();
    }

    async saveCountryList(countryList: Country[]): Promise<any> {
        // check exisitng records
        const count = (await this.getCountryList()).length;
        console.log('Country list found in database. No futher action is required.');

        if(count <= 0) {
            for(let i = 0; i < countryList.length; i++) {
                await this.country.add(countryList[i]);
            }
        }
    }

    async getCountryName(cc: string): Promise<Country> {
        return await this.country.get(cc);
    }

    async getNewsList(cc: string): Promise<NewsCollection> {
        return await this.news.get(cc);
    }

    async saveNewsList(cc: string, cachedNewsList: cachedNewsList): Promise<any> {
        // check exisitng records
        const result = await this.getNewsList(cc);
        console.log(result);

        if(result) {
            console.log('Country code found. Saving news list...');
            await this.news.update(cc, { cachedList: cachedNewsList });
            console.log('Cached news list updated successfully.');
        } else {
            console.log('Country code not found. Saving news list...');
            await this.news.put({
                cc: cc,
                cachedList: cachedNewsList
            }, cc);
            console.log('New cached news list added successfully.');
        }
    }
}