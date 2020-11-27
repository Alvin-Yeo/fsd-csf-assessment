import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-news-api',
  templateUrl: './news-api.component.html',
  styleUrls: ['./news-api.component.css']
})
export class NewsApiComponent implements OnInit {

  apiForm: FormGroup;
  apiKey = '';

  constructor(
    private fb: FormBuilder,
    private db: NewsDatabase,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkApiKey();
    this.apiForm = this.fb.group({
      key: this.fb.control(this.apiKey, [ Validators.required ])
    });
  }

  get key() { return this.apiForm.get('key') }

  async checkApiKey() {
    const result = await this.db.getApiKey();

    if(result.length > 0) 
      this.apiKey = result[0].apikey;
    
    this.apiForm = this.fb.group({
      key: this.fb.control(this.apiKey, [ Validators.required ])
    });
  }

  async saveApiKey() {
    await this.db.saveApiKey(this.key.value);
    this.router.navigate(['/country']);
  }

  async deleteApiKey() {
    await this.db.deleteApiKey();
    this.router.navigate(['/']);
  }

}
