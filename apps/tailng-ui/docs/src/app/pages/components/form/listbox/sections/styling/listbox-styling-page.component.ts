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
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 1rem;',
    '  background: var(--tng-semantic-background-surface);',
    '  color: var(--tng-semantic-foreground-primary);',
    '}',
    '',
    '.project-listbox-card tng-listbox {',
    '  width: 100%;',
    '  max-width: none;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindExampleCode = [
    '<div class="w-full max-w-none rounded-xl">',
    '  <tng-listbox',
    '    ariaLabel="Project queue"',
    '    [options]="projectOptions"',
    '    [value]="selectedProject()"',
    '    (valueChange)="onSelectedProjectChange($event)"',
    '  ></tng-listbox>',
    '</div>',
    '',
  ].join('\n');
}
