import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTngCodeHighlighting } from '@tailng-ui/components';
import { appRoutes } from './app.routes';
import { shikiCodeHighlighterAdapter } from './code-highlighting/shiki-code-highlighter.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideTngCodeHighlighting({
      adapters: [shikiCodeHighlighterAdapter],
      defaultAdapter: 'shiki',
    }),
  ],
};
