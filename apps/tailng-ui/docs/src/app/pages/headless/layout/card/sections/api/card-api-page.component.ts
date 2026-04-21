import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-card-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './card-api-page.component.html',
  styleUrl: './card-api-page.component.css',
})
export class HeadlessCardApiPageComponent {
  protected readonly attachmentCode = [
    '<article tngCard>',
    '  <div tngCardMedia>...</div>',
    '  <header tngCardHeader>',
    '    <h3 tngCardTitle>Roadmap update</h3>',
    '    <p tngCardDescription>Plan next-quarter work and owners.</p>',
    '  </header>',
    '  <section tngCardContent>...</section>',
    '  <hr tngCardDivider />',
    '  <footer tngCardFooter>',
    '    <a tngCardLink href="/roadmap">Open board</a>',
    '    <div tngCardActions>...</div>',
    '  </footer>',
    '</article>',
    '',
  ].join('\n');
}
