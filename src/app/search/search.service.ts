import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
import { Author } from '../shared/author';

export interface Result {
  author: Author;
  question: {
    title: string;
    id: number;
  };
  answers: number;
  tags: string[];
}

export interface SearchOptions {
  query?: string;
  tag?: string;
  author?: Author;
  sort?: string;
}

const filter = '!*7PYFiX04qF206j0aQZ)4CtQrFbC';
const defaultSort = 'relevance';
const path = '/search/advanced';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  cachedQuery = '';
  cachedResults: Result[] = [];
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getResults({ query, tag, author, sort }: SearchOptions) {
    const { baseUrl, site, pageSize } = this.apiService;
    const url = `${baseUrl}${path}`;
    const params = {
      title: query ?? '',
      tagged: tag ?? '',
      user: author?.id?.toString() ?? '',
      sort: sort ?? defaultSort,
      pagesize: pageSize.toString(),
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

  setCached(query: string, results: Result[]) {
    this.cachedQuery = query;
    this.cachedResults = results;
  }
}
