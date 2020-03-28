import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';

export interface Result {
  author: {
    name: string;
    id: number;
  };
  question: {
    title: string;
    id: number;
  };
  answers: number;
  tags: string[];
}

const filter = '!*7PYFiX04qF206j0aQZ)4CtQrFbC';
const path = '/search';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getResults(query = '') {
    const { baseUrl, site } = this.apiService;
    const url = `${baseUrl}${path}`;
    const params = {
      intitle: query,
      site,
      filter,
    };

    return this.http
      .get(url, { params })
      .pipe(
        map(({ items }: any): Result[] => items.map((item: any) => ({
          author: {
            name: item.owner.display_name,
            id: item.owner.user_id,
          },
          question: {
            id: item.question_id,
            title: item.title
          },
          answers: item.answer_count,
          tags: item.tags,
        } as Result)))
      );
  }
}
