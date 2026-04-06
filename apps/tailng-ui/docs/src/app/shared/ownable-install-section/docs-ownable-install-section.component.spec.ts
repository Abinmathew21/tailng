import { NgFor, NgIf } from '@angular/common';
import { Component, Directive, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, type Data } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { DocsOwnableInstallSectionComponent } from './docs-ownable-install-section.component';

@Component({
  selector: 'tng-code-block',
  standalone: true,
  template: `<pre [attr.data-title]="title">{{ code }}</pre>`,
})
class StubCodeBlockComponent {
  @Input() public code = '';
  @Input() public adapter = '';
  @Input() public language = '';
  @Input() public title = '';
  @Input() public theme: unknown;
  @Input() public lineNumbers = false;
  @Input() public wrap = false;
  @Input() public sanitizeHtml = false;
}

@Component({
  selector: 'tng-tabs',
  standalone: true,
  template: `<ng-content />`,
})
class StubTabsComponent {
  @Input() public ariaLabel = '';
  @Input() public defaultValue = '';
}

@Directive({
  selector: '[tngTabList]',
  standalone: true,
})
class StubTabListDirective {}

@Directive({
  selector: '[tngTab]',
  standalone: true,
})
class StubTabDirective {
  @Input() public value = '';
}

@Directive({
  selector: '[tngTabPanel]',
  standalone: true,
})
class StubTabPanelDirective {
  @Input() public value = '';
}

function createActivatedRoute(registrySlug: string, usageCode: string, title = 'Input'): ActivatedRoute {
  return {
    parent: {
      snapshot: {
        data: {
          item: {
            title,
          },
        },
      },
    } as ActivatedRoute,
    snapshot: {
      data: {
        registrySlug,
        usageCode,
      } satisfies Data,
    },
  } as ActivatedRoute;
}

async function renderComponent(
  registrySlug: string,
  usageCode: string,
  title = 'Input',
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [DocsOwnableInstallSectionComponent],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: createActivatedRoute(registrySlug, usageCode, title),
      },
    ],
  });
  TestBed.overrideComponent(DocsOwnableInstallSectionComponent, {
    set: {
      imports: [
        NgFor,
        NgIf,
        StubCodeBlockComponent,
        StubTabsComponent,
        StubTabListDirective,
        StubTabDirective,
        StubTabPanelDirective,
      ],
    },
  });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(DocsOwnableInstallSectionComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('DocsOwnableInstallSectionComponent', () => {
  it('renders generated files from the registry item', async () => {
    const element = await renderComponent('button', '<tng-button></tng-button>', 'Button');
    const generatedFileEntries = Array.from(
      element.querySelectorAll('.docs-ownable-files-list code'),
      (node) => node.textContent?.trim() ?? '',
    );

    expect(generatedFileEntries).toContain('src/app/tailng-ui/button/tng-press-primitive.ts');
    expect(generatedFileEntries).toContain('src/app/tailng-ui/button/tng-button.ts');
    expect(generatedFileEntries).toContain('src/app/tailng-ui/button/index.ts');
  });

  it('renders import snippets from explicit registry install metadata', async () => {
    const element = await renderComponent('button', '<tng-button></tng-button>', 'Button');
    const importBlock = element.querySelector('pre[data-title="Imports"]');

    expect(importBlock?.textContent).toContain(
      "import { TngButton, TngPressPrimitive } from './tailng-ui/button';",
    );
  });

  it('renders install commands and usage for a valid registry slug', async () => {
    const element = await renderComponent('input', '<tng-input></tng-input>', 'Input');
    const pnpmBlock = element.querySelector('pre[data-title="pnpm"]');
    const usageBlock = element.querySelector('pre[data-title="Template usage"]');

    expect(element.textContent).toContain('Install Input from the TailNG registry');
    expect(pnpmBlock?.textContent).toContain('pnpm dlx tailng add input');
    expect(usageBlock?.textContent).toContain('<tng-input></tng-input>');
  });

  it('shows a clear warning and fallback import for an invalid registry slug', async () => {
    const element = await renderComponent(
      'missing-widget',
      '<missing-widget></missing-widget>',
      'Missing Widget',
    );
    const warning = element.querySelector('[data-testid="ownable-install-warning"]');
    const importBlock = element.querySelector('pre[data-title="Imports"]');
    const generatedFileEntries = element.querySelectorAll('.docs-ownable-files-list code');

    expect(warning?.textContent).toContain(
      'Registry item missing-widget is not available in the current ownable surface.',
    );
    expect(importBlock?.textContent).toContain("import './tailng-ui/missing-widget';");
    expect(generatedFileEntries.length).toBe(0);
  });
});
