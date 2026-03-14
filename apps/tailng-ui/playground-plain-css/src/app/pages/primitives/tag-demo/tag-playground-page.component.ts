import { Component, signal } from '@angular/core';
import { TngTag } from '@tailng-ui/components';
import {
  TngTag as TngTagPrimitive,
  TngTagClose,
  TngTagIcon,
} from '@tailng-ui/primitives';

type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

type TagItem = Readonly<{
  id: string;
  label: string;
  tone: TagTone;
}>;

const INITIAL_HEADLESS_TAGS: readonly TagItem[] = Object.freeze([
  { id: 'draft', label: 'Draft', tone: 'info' },
  { id: 'review', label: 'Review', tone: 'warning' },
  { id: 'stable', label: 'Stable', tone: 'success' },
]);

const INITIAL_COMPONENT_TAGS: readonly TagItem[] = Object.freeze([
  { id: 'api', label: 'API', tone: 'neutral' },
  { id: 'docs', label: 'Docs', tone: 'info' },
  { id: 'release', label: 'Release', tone: 'danger' },
]);

@Component({
  selector: 'app-tag-playground-page',
  imports: [TngTagPrimitive, TngTagClose, TngTagIcon, TngTag],
  templateUrl: './tag-playground-page.component.html',
  styleUrl: './tag-playground-page.component.css',
})
export class TagPlaygroundPageComponent {
  protected readonly headlessTags = signal<readonly TagItem[]>(INITIAL_HEADLESS_TAGS);
  protected readonly componentTags = signal<readonly TagItem[]>(INITIAL_COMPONENT_TAGS);
  protected readonly lastHeadlessRemoved = signal('None');
  protected readonly lastComponentRemoved = signal('None');

  protected removeHeadlessTag(tagId: string): void {
    this.headlessTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
    this.lastHeadlessRemoved.set(tagId);
  }

  protected removeComponentTag(tagId: string): void {
    this.componentTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
    this.lastComponentRemoved.set(tagId);
  }

  protected resetAll(): void {
    this.headlessTags.set(INITIAL_HEADLESS_TAGS);
    this.componentTags.set(INITIAL_COMPONENT_TAGS);
    this.lastHeadlessRemoved.set('None');
    this.lastComponentRemoved.set('None');
  }
}
