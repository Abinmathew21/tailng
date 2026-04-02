import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-listbox-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './listbox-styling-page.component.html',
  styleUrl: './listbox-styling-page.component.css',
})
export class ListboxStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.project-listbox-card {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  padding: 1rem;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 1rem;',
    '  background: #ffffff;',
    '  color: #0f172a;',
    '  color-scheme: light;',
    '}',
    '',
    '.project-listbox-card tng-listbox {',
    '  width: 100%;',
    '  max-width: none;',
    '  --tng-semantic-background-surface: #ffffff;',
    '  --tng-semantic-background-base: #f8fafc;',
    '  --tng-semantic-border-subtle: #cbd5e1;',
    '  --tng-semantic-accent-brand: #2563eb;',
    '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.18);',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-foreground-secondary: #475569;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindExampleCode = [
    '<tng-listbox',
    '  class="w-full max-w-none rounded-xl [--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-base:#f8fafc] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.18)] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569]"',
    '  ariaLabel="Project queue"',
    '  [options]="projectOptions"',
    '  [value]="selectedProject()"',
    '  (valueChange)="onSelectedProjectChange($event)"',
    '></tng-listbox>',
    '',
  ].join('\n');
}
