import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngCard,
  TngCardActions,
  TngCardContent,
  TngCardDescription,
  TngCardDivider,
  TngCardFooter,
  TngCardHeader,
  TngCardLink,
  TngCardMedia,
  TngCardTitle,
} from '../tng-card';

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

@Component({
  imports: [
    TngCard,
    TngCardHeader,
    TngCardTitle,
    TngCardDescription,
    TngCardContent,
    TngCardFooter,
    TngCardMedia,
    TngCardActions,
    TngCardDivider,
    TngCardLink,
  ],
  template: `
    <article tngCard data-testid="card">
      <header tngCardHeader data-testid="header">
        <h3 tngCardTitle data-testid="title">Card title</h3>
        <p tngCardDescription data-testid="description">Card description</p>
      </header>

      <div tngCardMedia data-testid="media">
        <img src="/mock.png" alt="mock" />
      </div>

      <section tngCardContent data-testid="content">
        <a tngCardLink data-testid="link" href="/docs" (click)="linkClicks += 1">Open docs</a>
      </section>

      <hr tngCardDivider data-testid="divider" />

      <div tngCardActions data-testid="actions">
        <button type="button">Action</button>
      </div>

      <footer tngCardFooter data-testid="footer">Footer</footer>
    </article>
  `,
})
class CardPrimitiveHarnessComponent {
  public linkClicks = 0;
}

describe('tng-card primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports all public card directives', () => {
    expect(typeof TngCard).toBe('function');
    expect(typeof TngCardHeader).toBe('function');
    expect(typeof TngCardTitle).toBe('function');
    expect(typeof TngCardDescription).toBe('function');
    expect(typeof TngCardContent).toBe('function');
    expect(typeof TngCardFooter).toBe('function');
    expect(typeof TngCardMedia).toBe('function');
    expect(typeof TngCardActions).toBe('function');
    expect(typeof TngCardDivider).toBe('function');
    expect(typeof TngCardLink).toBe('function');
  });

  it('applies data-slot hooks for every card part directive', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardPrimitiveHarnessComponent],
    }).createComponent(CardPrimitiveHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'card').getAttribute('data-slot')).toBe('card');
    expect(getByTestId<HTMLElement>(fixture, 'header').getAttribute('data-slot')).toBe('card-header');
    expect(getByTestId<HTMLElement>(fixture, 'title').getAttribute('data-slot')).toBe('card-title');
    expect(getByTestId<HTMLElement>(fixture, 'description').getAttribute('data-slot')).toBe(
      'card-description',
    );
    expect(getByTestId<HTMLElement>(fixture, 'content').getAttribute('data-slot')).toBe('card-content');
    expect(getByTestId<HTMLElement>(fixture, 'footer').getAttribute('data-slot')).toBe('card-footer');
    expect(getByTestId<HTMLElement>(fixture, 'media').getAttribute('data-slot')).toBe('card-media');
    expect(getByTestId<HTMLElement>(fixture, 'actions').getAttribute('data-slot')).toBe('card-actions');
    expect(getByTestId<HTMLElement>(fixture, 'divider').getAttribute('data-slot')).toBe('card-divider');
    expect(getByTestId<HTMLElement>(fixture, 'link').getAttribute('data-slot')).toBe('card-link');
  });

  it('preserves semantic host elements selected by the consumer template', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardPrimitiveHarnessComponent],
    }).createComponent(CardPrimitiveHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'card').tagName).toBe('ARTICLE');
    expect(getByTestId<HTMLElement>(fixture, 'header').tagName).toBe('HEADER');
    expect(getByTestId<HTMLElement>(fixture, 'title').tagName).toBe('H3');
    expect(getByTestId<HTMLElement>(fixture, 'description').tagName).toBe('P');
    expect(getByTestId<HTMLElement>(fixture, 'content').tagName).toBe('SECTION');
    expect(getByTestId<HTMLElement>(fixture, 'footer').tagName).toBe('FOOTER');
    expect(getByTestId<HTMLElement>(fixture, 'link').tagName).toBe('A');
  });

  it('keeps card root non-focusable by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardPrimitiveHarnessComponent],
    }).createComponent(CardPrimitiveHarnessComponent);
    fixture.detectChanges();

    const card = getByTestId<HTMLElement>(fixture, 'card');
    expect(card.getAttribute('tabindex')).toBeNull();
  });

  it('keeps card-link focusable and click-activatable', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardPrimitiveHarnessComponent],
    }).createComponent(CardPrimitiveHarnessComponent);
    fixture.detectChanges();

    const link = getByTestId<HTMLAnchorElement>(fixture, 'link');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('tabindex')).toBeNull();

    link.focus();
    expect(document.activeElement).toBe(link);

    const event = click(link);
    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.linkClicks).toBe(1);
  });
});
