import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import Fuse from 'fuse.js';
import { map, shareReplay } from 'rxjs/operators';

export type DocsSearchEntry = Readonly<{
  title: string;
  url: string;
  description?: string;
  section?: string;
  tags?: readonly string[];
  content?: string;
}>;

export type DocsSearchIndex = Readonly<{
  entries: readonly DocsSearchEntry[];
  fuse: Fuse<DocsSearchEntry>;
}>;

@Injectable({ providedIn: 'root' })
export class DocsSearchIndexService {
  private readonly http = inject(HttpClient);

  public readonly index$ = this.http.get<readonly DocsSearchEntry[]>('/search/index.json').pipe(
    map((entries): DocsSearchIndex => ({
      entries,
      fuse: new Fuse(entries, {
        includeScore: false,
        ignoreLocation: true,
        threshold: 0.4,
        keys: [
          { name: 'title', weight: 2 },
          { name: 'tags', weight: 1.5 },
          { name: 'section', weight: 1.2 },
          { name: 'description', weight: 1 },
          { name: 'content', weight: 0.5 },
        ],
      }),
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
