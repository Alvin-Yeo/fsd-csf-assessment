import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private db: NewsDatabase,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Checking API Key...');
    this.checkApiKey();
  }

  async checkApiKey() {
    const result = await this.db.getApiKey();
    // console.log('Result: ', result);

    if(result.length <= 0) {
      console.log('API Key not found.');
      this.router.navigate(['/apikey']);
    } else {
      console.log('API Key is retrieved successfully.');
      this.router.navigate(['/country']);
    }
  }

}
