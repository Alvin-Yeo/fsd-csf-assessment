export interface ApiKey {
    apikey: string;
    id?: number;
}

export interface Country {
    cc: string;
    name: string;
    flagUrl: string;
}

export interface News {
    source: string;
    author: string;
    title: string;
    desc: string;
    url: string;
    image: string;
    date: Date;
    content: string;
}

export interface cachedNewsList {
    news: News[];
    cachedTime: Date;
}

export interface NewsCollection {
    cc: string;
    cachedList?: cachedNewsList;
    saveList?: News[];
}