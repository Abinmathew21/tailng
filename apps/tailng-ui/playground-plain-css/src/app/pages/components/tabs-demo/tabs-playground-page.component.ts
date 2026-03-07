import { Component, signal } from '@angular/core';
import { TngTabs } from '@tailng-ui/components';
import {
  TngTab,
  TngTabChangeEvent,
  TngTabList,
  TngTabPanel,
  TngTabsScrollButtonNext,
  TngTabsScrollButtonPrev,
  TngTabs as TngTabsPrimitive,
  TngTabsFocusChangeEvent,
  TngTabsValue,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-tabs-playground-page',
  imports: [
    TngTabsPrimitive,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngTabsScrollButtonPrev,
    TngTabsScrollButtonNext,
    TngTabs,
  ],
  templateUrl: './tabs-playground-page.component.html',
  styleUrl: './tabs-playground-page.component.css',
})
export class TabsPlaygroundPageComponent {
  readonly overflowTabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'setup', label: 'Setup' },
    { value: 'usage', label: 'Usage' },
    { value: 'patterns', label: 'Patterns' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'performance', label: 'Performance' },
    { value: 'testing', label: 'Testing' },
    { value: 'migration', label: 'Migration' },
    { value: 'faq', label: 'FAQ' },
    { value: 'roadmap', label: 'Roadmap' },
  ] as const;

  readonly overflowSelection = signal('No overflow tab selected yet');
  readonly controlledValue = signal('profile');
  readonly headlessSelection = signal('No tab selected yet');
  readonly headlessFocus = signal('No tab focused yet');
  readonly controlledSelection = signal('No controlled change yet');
  readonly manualSelection = signal('No manual selection yet');

  onHeadlessTabChange(event: TngTabChangeEvent): void {
    this.headlessSelection.set(
      `${String(event.previousValue ?? 'none')} -> ${String(event.value)} (${event.trigger})`,
    );
  }

  onHeadlessFocusChange(event: TngTabsFocusChangeEvent): void {
    this.headlessFocus.set(
      `${String(event.previousValue ?? 'none')} -> ${String(event.value)} (${event.trigger})`,
    );
  }

  onControlledValueChange(value: TngTabsValue | null): void {
    if (value === null) {
      return;
    }

    this.controlledValue.set(String(value));
  }

  onControlledTabChange(event: TngTabChangeEvent): void {
    this.controlledSelection.set(
      `${String(event.previousValue ?? 'none')} -> ${String(event.value)} (${event.trigger})`,
    );
  }

  setControlledValue(value: TngTabsValue): void {
    this.controlledValue.set(String(value));
  }

  onManualTabChange(event: TngTabChangeEvent): void {
    this.manualSelection.set(
      `${String(event.previousValue ?? 'none')} -> ${String(event.value)} (${event.trigger})`,
    );
  }

  onOverflowTabChange(event: TngTabChangeEvent): void {
    this.overflowSelection.set(
      `${String(event.previousValue ?? 'none')} -> ${String(event.value)} (${event.trigger})`,
    );
  }
}
