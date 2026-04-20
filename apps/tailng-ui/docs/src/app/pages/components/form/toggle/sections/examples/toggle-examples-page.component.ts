import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../toggle.util';

type ReviewLayout = 'board' | 'table' | 'timeline';
type PublishTarget = 'email' | 'slack' | 'status';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

function isReviewLayout(value: string | null): value is ReviewLayout {
  return value === 'board' || value === 'table' || value === 'timeline';
}

function isPublishTarget(value: string): value is PublishTarget {
  return value === 'email' || value === 'slack' || value === 'status';
}

function formatSelectionSummary(values: readonly string[]): string {
  return values.length > 0 ? values.join(', ') : 'none';
}

function eventCameFromToggle(event: Event): boolean {
  const target = event.target;
  return target instanceof Element && target.closest('tng-toggle') !== null;
}

function togglePublishTarget(
  currentValues: readonly PublishTarget[],
  target: PublishTarget,
): readonly PublishTarget[] {
  return currentValues.includes(target)
    ? currentValues.filter((value) => value !== target)
    : [...currentValues, target];
}

@Component({
  selector: 'app-toggle-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngToggleComponent,
    TngToggleGroupComponent,
  ],
  templateUrl: './toggle-examples-page.component.html',
  styleUrl: './toggle-examples-page.component.css',
})
export class ToggleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssBoldActive = signal(true);
  protected readonly plainCssItalicActive = signal(false);
  protected readonly plainCssCodeActive = signal(true);
  protected readonly tailwindBoldActive = signal(true);
  protected readonly tailwindItalicActive = signal(true);
  protected readonly tailwindCodeActive = signal(false);

  protected readonly plainCssReviewLayout = signal<ReviewLayout>('table');
  protected readonly tailwindReviewLayout = signal<ReviewLayout>('board');

  protected readonly plainCssPublishTargets = signal<readonly PublishTarget[]>(['slack']);
  protected readonly tailwindPublishTargets = signal<readonly PublishTarget[]>(['email', 'status']);

  protected readonly plainCssFormattingSummary = computed<string>(() => {
    const active: string[] = [];
    if (this.plainCssBoldActive()) {
      active.push('bold');
    }
    if (this.plainCssItalicActive()) {
      active.push('italic');
    }
    if (this.plainCssCodeActive()) {
      active.push('code');
    }
    return formatSelectionSummary(active);
  });

  protected readonly tailwindFormattingSummary = computed<string>(() => {
    const active: string[] = [];
    if (this.tailwindBoldActive()) {
      active.push('bold');
    }
    if (this.tailwindItalicActive()) {
      active.push('italic');
    }
    if (this.tailwindCodeActive()) {
      active.push('code');
    }
    return formatSelectionSummary(active);
  });

  protected readonly plainCssPublishSummary = computed<string>(() => {
    return formatSelectionSummary(this.plainCssPublishTargets());
  });

  protected readonly tailwindPublishSummary = computed<string>(() => {
    return formatSelectionSummary(this.tailwindPublishTargets());
  });

  protected readonly formattingPlainCodeTabs = createCodeTabs(
    'component-toggle-formatting-plain',
    `import { Component, computed, signal } from '@angular/core';
import { TngToggleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-toggle-formatting-plain',
  standalone: true,
  imports: [TngToggleComponent],
  templateUrl: './component-toggle-formatting-plain.component.html',
  styleUrl: './component-toggle-formatting-plain.component.css',
})
export class ComponentToggleFormattingPlainComponent {
  readonly boldActive = signal(true);
  readonly italicActive = signal(false);
  readonly codeActive = signal(true);

  readonly activeFormattingSummary = computed(() => {
    const active: string[] = [];
    if (this.boldActive()) {
      active.push('bold');
    }
    if (this.italicActive()) {
      active.push('italic');
    }
    if (this.codeActive()) {
      active.push('code');
    }
    return active.length > 0 ? active.join(', ') : 'none';
  });
}`,
    `<section class="toggle-formatting-card">
  <div class="toggle-formatting-card__header">
    <p class="toggle-formatting-card__eyebrow">Editing toolbar</p>
    <h3 class="toggle-formatting-card__title">Formatting actions</h3>
    <p class="toggle-formatting-card__body">
      Standalone toggles work well for independent editor actions.
    </p>
  </div>

  <div class="toggle-formatting-card__toolbar" role="toolbar" aria-label="Formatting actions">
    <tng-toggle
      [pressed]="boldActive()"
      pressedLabel="Disable bold"
      unpressedLabel="Enable bold"
      (pressedChange)="boldActive.set($event)"
    >
      <span offIcon>B</span>
      <span onIcon>B</span>
    </tng-toggle>
    <tng-toggle
      [pressed]="italicActive()"
      pressedLabel="Disable italic"
      unpressedLabel="Enable italic"
      (pressedChange)="italicActive.set($event)"
    >
      <span offIcon>I</span>
      <span onIcon>I</span>
    </tng-toggle>
    <tng-toggle
      [pressed]="codeActive()"
      pressedLabel="Disable code style"
      unpressedLabel="Enable code style"
      (pressedChange)="codeActive.set($event)"
    >
      <span offIcon>C</span>
      <span onIcon>C</span>
    </tng-toggle>
  </div>

  <p class="toggle-formatting-card__summary">Active: {{ activeFormattingSummary() }}</p>
</section>`,
    `.toggle-formatting-card {
  display: grid;
  gap: 1rem;
  inline-size: min(100%, 32rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  color-scheme: light;
  box-shadow: 0 18px 40px -34px rgba(15, 23, 42, 0.25);
}

.toggle-formatting-card__header {
  display: grid;
  gap: 0.35rem;
}

.toggle-formatting-card__eyebrow {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.toggle-formatting-card__title {
  margin: 0;
  color: var(--tng-semantic-foreground-primary);
  font-size: 1.05rem;
  font-weight: 700;
}

.toggle-formatting-card__body {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.toggle-formatting-card__toolbar {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.toggle-formatting-card__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.82rem;
  text-transform: lowercase;
}`,
  );

  protected readonly formattingTailwindCodeTabs = createCodeTabs(
    'component-toggle-formatting-tailwind',
    `import { Component, computed, signal } from '@angular/core';
import { TngToggleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-toggle-formatting-tailwind',
  standalone: true,
  imports: [TngToggleComponent],
  templateUrl: './component-toggle-formatting-tailwind.component.html',
})
export class ComponentToggleFormattingTailwindComponent {
  readonly boldActive = signal(true);
  readonly italicActive = signal(true);
  readonly codeActive = signal(false);

  readonly activeFormattingSummary = computed(() => {
    const active: string[] = [];
    if (this.boldActive()) {
      active.push('bold');
    }
    if (this.italicActive()) {
      active.push('italic');
    }
    if (this.codeActive()) {
      active.push('code');
    }
    return active.length > 0 ? active.join(', ') : 'none';
  });
}`,
    `<section class="grid w-full max-w-[32rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-foreground-secondary)]">
      Editing toolbar
    </p>
    <h3 class="m-0 text-lg font-semibold text-[var(--tng-semantic-foreground-primary)]">Formatting actions</h3>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">
      Standalone toggles work well for independent editor actions.
    </p>
  </div>

  <div class="flex flex-wrap gap-3" role="toolbar" aria-label="Formatting actions">
    <tng-toggle
      [pressed]="boldActive()"
      pressedLabel="Disable bold"
      unpressedLabel="Enable bold"
      (pressedChange)="boldActive.set($event)"
    >
      <span offIcon>B</span>
      <span onIcon>B</span>
    </tng-toggle>
    <tng-toggle
      [pressed]="italicActive()"
      pressedLabel="Disable italic"
      unpressedLabel="Enable italic"
      (pressedChange)="italicActive.set($event)"
    >
      <span offIcon>I</span>
      <span onIcon>I</span>
    </tng-toggle>
    <tng-toggle
      [pressed]="codeActive()"
      pressedLabel="Disable code style"
      unpressedLabel="Enable code style"
      (pressedChange)="codeActive.set($event)"
    >
      <span offIcon>C</span>
      <span onIcon>C</span>
    </tng-toggle>
  </div>

  <p class="m-0 text-xs lowercase text-[var(--tng-semantic-foreground-secondary)]">Active: {{ activeFormattingSummary() }}</p>
</section>`,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly layoutPlainCodeTabs = createCodeTabs(
    'component-toggle-layout-plain',
    `import { Component, signal } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';

type ReviewLayout = 'board' | 'table' | 'timeline';

@Component({
  selector: 'app-component-toggle-layout-plain',
  standalone: true,
  imports: [TngToggleComponent, TngToggleGroupComponent],
  templateUrl: './component-toggle-layout-plain.component.html',
  styleUrl: './component-toggle-layout-plain.component.css',
})
export class ComponentToggleLayoutPlainComponent {
  readonly selectedReviewLayout = signal<ReviewLayout>('table');

  onReviewLayoutChange(value: string | null): void {
    if (value === 'board' || value === 'table' || value === 'timeline') {
      this.selectedReviewLayout.set(value);
    }
  }

  onReviewLayoutChoiceClick(value: ReviewLayout, event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('tng-toggle') !== null) {
      return;
    }

    this.selectedReviewLayout.set(value);
  }
}`,
    `<section class="toggle-layout-card">
  <div class="toggle-layout-card__header">
    <h3 class="toggle-layout-card__title">Review queue layout</h3>
    <p class="toggle-layout-card__body">Choose the default workspace for triage and approvals.</p>
  </div>

  <tng-toggle-group
    selectionMode="single"
    ariaLabel="Review queue layout"
    [value]="selectedReviewLayout()"
    (valueChange)="onReviewLayoutChange($event)"
  >
    <div class="toggle-layout-card__choice" [class.toggle-layout-card__choice--active]="selectedReviewLayout() === 'board'" (click)="onReviewLayoutChoiceClick('board', $event)">
      <tng-toggle [value]="'board'" pressedLabel="Board layout selected" unpressedLabel="Select board layout">
        <span offIcon>B</span>
        <span onIcon>B</span>
      </tng-toggle>
      <div class="toggle-layout-card__copy">
        <span class="toggle-layout-card__label">Board</span>
        <span class="toggle-layout-card__meta">Kanban lanes for rapid triage.</span>
      </div>
    </div>
    <div class="toggle-layout-card__choice" [class.toggle-layout-card__choice--active]="selectedReviewLayout() === 'table'" (click)="onReviewLayoutChoiceClick('table', $event)">
      <tng-toggle [value]="'table'" pressedLabel="Table layout selected" unpressedLabel="Select table layout">
        <span offIcon>T</span>
        <span onIcon>T</span>
      </tng-toggle>
      <div class="toggle-layout-card__copy">
        <span class="toggle-layout-card__label">Table</span>
        <span class="toggle-layout-card__meta">Dense scanning across columns.</span>
      </div>
    </div>
    <div class="toggle-layout-card__choice" [class.toggle-layout-card__choice--active]="selectedReviewLayout() === 'timeline'" (click)="onReviewLayoutChoiceClick('timeline', $event)">
      <tng-toggle [value]="'timeline'" pressedLabel="Timeline layout selected" unpressedLabel="Select timeline layout">
        <span offIcon>L</span>
        <span onIcon>L</span>
      </tng-toggle>
      <div class="toggle-layout-card__copy">
        <span class="toggle-layout-card__label">Timeline</span>
        <span class="toggle-layout-card__meta">Chronological incident playback.</span>
      </div>
    </div>
  </tng-toggle-group>

  <p class="toggle-layout-card__summary">Selected: {{ selectedReviewLayout() }}</p>
</section>`,
    `.toggle-layout-card {
  display: grid;
  gap: 1rem;
  inline-size: min(100%, 38rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  color-scheme: light;
}

.toggle-layout-card__header {
  display: grid;
  gap: 0.35rem;
}

.toggle-layout-card__title {
  margin: 0;
  color: var(--tng-semantic-foreground-primary);
  font-size: 1.05rem;
  font-weight: 700;
}

.toggle-layout-card__body {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.toggle-layout-card tng-toggle-group {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  border: 0;
  background: transparent;
}

.toggle-layout-card__choice {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem;
  align-items: center;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%);
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
}

.toggle-layout-card__choice--active {
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%);
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%);
}

.toggle-layout-card__copy {
  display: grid;
  gap: 0.1rem;
}

.toggle-layout-card__label {
  color: var(--tng-semantic-foreground-primary);
  font-size: 0.92rem;
  font-weight: 700;
}

.toggle-layout-card__meta {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
}

.toggle-layout-card__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.82rem;
  text-transform: capitalize;
}`,
  );

  protected readonly layoutTailwindCodeTabs = createCodeTabs(
    'component-toggle-layout-tailwind',
    `import { Component, signal } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';

type ReviewLayout = 'board' | 'table' | 'timeline';

@Component({
  selector: 'app-component-toggle-layout-tailwind',
  standalone: true,
  imports: [TngToggleComponent, TngToggleGroupComponent],
  templateUrl: './component-toggle-layout-tailwind.component.html',
})
export class ComponentToggleLayoutTailwindComponent {
  readonly selectedReviewLayout = signal<ReviewLayout>('board');

  onReviewLayoutChange(value: string | null): void {
    if (value === 'board' || value === 'table' || value === 'timeline') {
      this.selectedReviewLayout.set(value);
    }
  }

  onReviewLayoutChoiceClick(value: ReviewLayout, event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('tng-toggle') !== null) {
      return;
    }

    this.selectedReviewLayout.set(value);
  }
}`,
    `<section class="grid w-full max-w-[38rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <h3 class="m-0 text-lg font-semibold text-[var(--tng-semantic-foreground-primary)]">Review queue layout</h3>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Choose the default workspace for triage and approvals.</p>
  </div>

  <tng-toggle-group
    selectionMode="single"
    ariaLabel="Review queue layout"
    [value]="selectedReviewLayout()"
    (valueChange)="onReviewLayoutChange($event)"
  >
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedReviewLayout() === 'board' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedReviewLayout() === 'board' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onReviewLayoutChoiceClick('board', $event)">
      <tng-toggle [value]="'board'" pressedLabel="Board layout selected" unpressedLabel="Select board layout">
        <span offIcon>B</span>
        <span onIcon>B</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Board</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Kanban lanes for rapid triage.</span>
      </div>
    </div>
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedReviewLayout() === 'table' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedReviewLayout() === 'table' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onReviewLayoutChoiceClick('table', $event)">
      <tng-toggle [value]="'table'" pressedLabel="Table layout selected" unpressedLabel="Select table layout">
        <span offIcon>T</span>
        <span onIcon>T</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Table</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Dense scanning across columns.</span>
      </div>
    </div>
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedReviewLayout() === 'timeline' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedReviewLayout() === 'timeline' ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onReviewLayoutChoiceClick('timeline', $event)">
      <tng-toggle [value]="'timeline'" pressedLabel="Timeline layout selected" unpressedLabel="Select timeline layout">
        <span offIcon>L</span>
        <span onIcon>L</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Timeline</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Chronological incident playback.</span>
      </div>
    </div>
  </tng-toggle-group>

  <p class="m-0 text-xs capitalize text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedReviewLayout() }}</p>
</section>`,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly publishPlainCodeTabs = createCodeTabs(
    'component-toggle-publish-plain',
    `import { Component, computed, signal } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';

type PublishTarget = 'email' | 'slack' | 'status';

@Component({
  selector: 'app-component-toggle-publish-plain',
  standalone: true,
  imports: [TngToggleComponent, TngToggleGroupComponent],
  templateUrl: './component-toggle-publish-plain.component.html',
  styleUrl: './component-toggle-publish-plain.component.css',
})
export class ComponentTogglePublishPlainComponent {
  readonly selectedPublishTargets = signal<readonly PublishTarget[]>(['slack']);
  readonly publishSummary = computed(() => {
    const values = this.selectedPublishTargets();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onPublishTargetsChange(values: readonly string[]): void {
    this.selectedPublishTargets.set(
      values.filter(
        (value): value is PublishTarget =>
          value === 'email' || value === 'slack' || value === 'status',
      ),
    );
  }

  onPublishTargetChoiceClick(value: PublishTarget, event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('tng-toggle') !== null) {
      return;
    }

    this.selectedPublishTargets.set(togglePublishTarget(this.selectedPublishTargets(), value));
  }
}`,
    `<section class="toggle-publish-card">
  <div class="toggle-publish-card__header">
    <h3 class="toggle-publish-card__title">Publish targets</h3>
    <p class="toggle-publish-card__body">Choose where the rollout summary should be delivered.</p>
  </div>

  <tng-toggle-group
    selectionMode="multiple"
    ariaLabel="Publish targets"
    [values]="selectedPublishTargets()"
    (valuesChange)="onPublishTargetsChange($event)"
  >
    <div class="toggle-publish-card__choice" [class.toggle-publish-card__choice--active]="selectedPublishTargets().includes('email')" (click)="onPublishTargetChoiceClick('email', $event)">
      <tng-toggle [value]="'email'" pressedLabel="Email target selected" unpressedLabel="Select email target">
        <span offIcon>E</span>
        <span onIcon>E</span>
      </tng-toggle>
      <div class="toggle-publish-card__copy">
        <span class="toggle-publish-card__label">Email</span>
        <span class="toggle-publish-card__meta">Send a concise release digest to stakeholders.</span>
      </div>
    </div>
    <div class="toggle-publish-card__choice" [class.toggle-publish-card__choice--active]="selectedPublishTargets().includes('slack')" (click)="onPublishTargetChoiceClick('slack', $event)">
      <tng-toggle [value]="'slack'" pressedLabel="Slack target selected" unpressedLabel="Select Slack target">
        <span offIcon>S</span>
        <span onIcon>S</span>
      </tng-toggle>
      <div class="toggle-publish-card__copy">
        <span class="toggle-publish-card__label">Slack</span>
        <span class="toggle-publish-card__meta">Post the summary into the release channel.</span>
      </div>
    </div>
    <div class="toggle-publish-card__choice" [class.toggle-publish-card__choice--active]="selectedPublishTargets().includes('status')" (click)="onPublishTargetChoiceClick('status', $event)">
      <tng-toggle [value]="'status'" pressedLabel="Status page target selected" unpressedLabel="Select status page target">
        <span offIcon>P</span>
        <span onIcon>P</span>
      </tng-toggle>
      <div class="toggle-publish-card__copy">
        <span class="toggle-publish-card__label">Status page</span>
        <span class="toggle-publish-card__meta">Update the public rollout timeline.</span>
      </div>
    </div>
  </tng-toggle-group>

  <p class="toggle-publish-card__summary">Targets: {{ publishSummary() }}</p>
</section>`,
    `.toggle-publish-card {
  display: grid;
  gap: 1rem;
  inline-size: min(100%, 38rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  color-scheme: light;
}

.toggle-publish-card__header {
  display: grid;
  gap: 0.35rem;
}

.toggle-publish-card__title {
  margin: 0;
  color: var(--tng-semantic-foreground-primary);
  font-size: 1.05rem;
  font-weight: 700;
}

.toggle-publish-card__body {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.toggle-publish-card tng-toggle-group {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  border: 0;
  background: transparent;
}

.toggle-publish-card__choice {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem;
  align-items: center;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%);
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
}

.toggle-publish-card__choice--active {
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%);
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%);
}

.toggle-publish-card__copy {
  display: grid;
  gap: 0.1rem;
}

.toggle-publish-card__label {
  color: var(--tng-semantic-foreground-primary);
  font-size: 0.92rem;
  font-weight: 700;
}

.toggle-publish-card__meta {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
}

.toggle-publish-card__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.82rem;
  text-transform: lowercase;
}`,
  );

  protected readonly publishTailwindCodeTabs = createCodeTabs(
    'component-toggle-publish-tailwind',
    `import { Component, computed, signal } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';

type PublishTarget = 'email' | 'slack' | 'status';

@Component({
  selector: 'app-component-toggle-publish-tailwind',
  standalone: true,
  imports: [TngToggleComponent, TngToggleGroupComponent],
  templateUrl: './component-toggle-publish-tailwind.component.html',
})
export class ComponentTogglePublishTailwindComponent {
  readonly selectedPublishTargets = signal<readonly PublishTarget[]>(['email', 'status']);
  readonly publishSummary = computed(() => {
    const values = this.selectedPublishTargets();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onPublishTargetsChange(values: readonly string[]): void {
    this.selectedPublishTargets.set(
      values.filter(
        (value): value is PublishTarget =>
          value === 'email' || value === 'slack' || value === 'status',
      ),
    );
  }

  onPublishTargetChoiceClick(value: PublishTarget, event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('tng-toggle') !== null) {
      return;
    }

    this.selectedPublishTargets.set(togglePublishTarget(this.selectedPublishTargets(), value));
  }
}`,
    `<section class="grid w-full max-w-[38rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <h3 class="m-0 text-lg font-semibold text-[var(--tng-semantic-foreground-primary)]">Publish targets</h3>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Choose where the rollout summary should be delivered.</p>
  </div>

  <tng-toggle-group
    selectionMode="multiple"
    ariaLabel="Publish targets"
    [values]="selectedPublishTargets()"
    (valuesChange)="onPublishTargetsChange($event)"
  >
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedPublishTargets().includes('email') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedPublishTargets().includes('email') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onPublishTargetChoiceClick('email', $event)">
      <tng-toggle [value]="'email'" pressedLabel="Email target selected" unpressedLabel="Select email target">
        <span offIcon>E</span>
        <span onIcon>E</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Email</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Send a concise release digest to stakeholders.</span>
      </div>
    </div>
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedPublishTargets().includes('slack') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedPublishTargets().includes('slack') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onPublishTargetChoiceClick('slack', $event)">
      <tng-toggle [value]="'slack'" pressedLabel="Slack target selected" unpressedLabel="Select Slack target">
        <span offIcon>S</span>
        <span onIcon>S</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Slack</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Post the summary into the release channel.</span>
      </div>
    </div>
    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedPublishTargets().includes('status') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)' : 'var(--tng-semantic-border-subtle)'" [style.background]="selectedPublishTargets().includes('status') ? 'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)' : 'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)'" (click)="onPublishTargetChoiceClick('status', $event)">
      <tng-toggle [value]="'status'" pressedLabel="Status page target selected" unpressedLabel="Select status page target">
        <span offIcon>P</span>
        <span onIcon>P</span>
      </tng-toggle>
      <div class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Status page</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Update the public rollout timeline.</span>
      </div>
    </div>
  </tng-toggle-group>

  <p class="m-0 text-xs lowercase text-[var(--tng-semantic-foreground-secondary)]">Targets: {{ publishSummary() }}</p>
</section>`,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainCssReviewLayoutChange(value: string | null): void {
    if (isReviewLayout(value)) {
      this.plainCssReviewLayout.set(value);
    }
  }

  protected onPlainCssReviewLayoutChoiceClick(value: ReviewLayout, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.plainCssReviewLayout.set(value);
  }

  protected onTailwindReviewLayoutChange(value: string | null): void {
    if (isReviewLayout(value)) {
      this.tailwindReviewLayout.set(value);
    }
  }

  protected onTailwindReviewLayoutChoiceClick(value: ReviewLayout, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.tailwindReviewLayout.set(value);
  }

  protected onPlainCssPublishTargetsChange(values: readonly string[]): void {
    this.plainCssPublishTargets.set(values.filter(isPublishTarget));
  }

  protected onPlainCssPublishTargetChoiceClick(value: PublishTarget, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.plainCssPublishTargets.set(togglePublishTarget(this.plainCssPublishTargets(), value));
  }

  protected onTailwindPublishTargetsChange(values: readonly string[]): void {
    this.tailwindPublishTargets.set(values.filter(isPublishTarget));
  }

  protected onTailwindPublishTargetChoiceClick(value: PublishTarget, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.tailwindPublishTargets.set(togglePublishTarget(this.tailwindPublishTargets(), value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
