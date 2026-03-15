import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

const createPopoverPanelId = createTngIdFactory('tng-popover-panel');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type OptionalBooleanInput = boolean | null | string | undefined;

export type TngPopoverAutoFocus = 'first-focusable' | 'none' | 'panel';
export type TngPopoverSide = 'bottom' | 'left' | 'right' | 'top';
export type TngPopoverAlign = 'center' | 'end' | 'start';
export type TngPopoverPanelRole = 'dialog' | 'listbox' | 'menu' | 'none' | 'region';
export type TngPopoverAriaHasPopup = 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree' | 'true';
export type TngPopoverCloseReason = 'escape' | 'outside-pointer' | 'programmatic' | 'trigger-toggle';

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function isPopoverCloseReason(value: string): value is TngPopoverCloseReason {
  return value === 'escape' || value === 'outside-pointer' || value === 'programmatic' || value === 'trigger-toggle';
}

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

export function readPopoverEventTarget(event: unknown): Node | null {
  if (event === null || typeof event !== 'object') {
    return null;
  }

  const eventTarget = (event as Event).target;
  return eventTarget instanceof Node ? eventTarget : null;
}

export function resolvePopoverGlobalDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export function resolvePopoverActiveElement(documentRef: unknown): HTMLElement | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  const active = documentRef.activeElement;
  return active instanceof HTMLElement ? active : null;
}

export function resolvePopoverFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

export function resolvePopoverMarkedInitialElement(container: unknown): HTMLElement | null {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-popover-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolvePopoverFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolvePopoverFocusableElements(markedInitial)[0] ?? null;
}

@Directive({
  selector: '[tngPopover]',
  exportAs: 'tngPopover',
  standalone: true,
})
export class TngPopover implements OnDestroy, OnInit {
  public readonly openInput = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    alias: 'open',
    transform: normalizeOptionalBooleanInput,
  });
  public readonly defaultOpen = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly autoFocus = input<TngPopoverAutoFocus, string | TngPopoverAutoFocus>('first-focusable', {
    transform: (value: string | TngPopoverAutoFocus): TngPopoverAutoFocus => {
      return value === 'none' || value === 'panel' || value === 'first-focusable' ? value : 'first-focusable';
    },
  });
  public readonly side = input<TngPopoverSide, string | TngPopoverSide>('bottom', {
    transform: (value: string | TngPopoverSide): TngPopoverSide => {
      return value === 'top' || value === 'right' || value === 'bottom' || value === 'left' ? value : 'bottom';
    },
  });
  public readonly align = input<TngPopoverAlign, string | TngPopoverAlign>('start', {
    transform: (value: string | TngPopoverAlign): TngPopoverAlign => {
      return value === 'start' || value === 'center' || value === 'end' ? value : 'start';
    },
  });
  public readonly panelRole = input<TngPopoverPanelRole, string | TngPopoverPanelRole>('dialog', {
    transform: (value: string | TngPopoverPanelRole): TngPopoverPanelRole => {
      return value === 'dialog' || value === 'menu' || value === 'listbox' || value === 'region' || value === 'none'
        ? value
        : 'dialog';
    },
  });
  public readonly ariaHasPopup = input<TngPopoverAriaHasPopup, string | TngPopoverAriaHasPopup>('dialog', {
    transform: (value: string | TngPopoverAriaHasPopup): TngPopoverAriaHasPopup => {
      return value === 'dialog'
        || value === 'menu'
        || value === 'listbox'
        || value === 'tree'
        || value === 'grid'
        || value === 'true'
        ? value
        : 'dialog';
    },
  });
  public readonly ariaLabel = input<string | null>(null);

  public readonly openChange = output<boolean>();
  public readonly closed = output<TngPopoverCloseReason>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly documentRef = resolvePopoverGlobalDocument();
  private readonly uncontrolledOpen = signal(false);
  private readonly openStateEffect = effect((): void => {
    if (!this.initialized) {
      return;
    }

    if (this.isOpen()) {
      this.activatePopover();
      return;
    }

    this.deactivatePopover();
  });

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    this.handleDocumentKeydown(event);
  };

  private readonly onDocumentPointerdown = (event: PointerEvent): void => {
    this.handleDocumentPointerdown(event);
  };

  private initialized = false;
  private isActive = false;
  private panelElement: HTMLElement | null = null;
  private panelElementId: string | null = null;
  private triggerElement: HTMLElement | null = null;
  private restoreFocusElement: HTMLElement | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngPopoverSide {
    return this.side();
  }

  @HostBinding('attr.data-align')
  protected get dataAlignAttr(): TngPopoverAlign {
    return this.align();
  }

  public ngOnInit(): void {
    if (!this.isControlled()) {
      this.uncontrolledOpen.set(this.defaultOpen());
    }

    this.initialized = true;
    if (this.isOpen()) {
      this.activatePopover();
    }
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivatePopover();
  }

  public isOpen(): boolean {
    return this.openInput() ?? this.uncontrolledOpen();
  }

  public openPopover(): void {
    if (this.disabled() || this.isOpen()) {
      return;
    }

    this.restoreFocusElement = resolvePopoverActiveElement(this.documentRef);
    this.setOpenState(true);
  }

  public closePopover(reason: TngPopoverCloseReason = 'programmatic'): void {
    this.requestClose(reason);
  }

  public togglePopover(force?: boolean): void {
    if (force === true) {
      this.openPopover();
      return;
    }

    if (force === false) {
      this.closePopover('programmatic');
      return;
    }

    if (this.isOpen()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.openPopover();
  }

  public requestClose(reason: TngPopoverCloseReason): void {
    if (!this.isOpen()) {
      return;
    }

    this.closed.emit(reason);
    this.setOpenState(false);
    this.restoreFocusToTrigger();
  }

  public registerTrigger(trigger: HTMLElement): void {
    this.triggerElement = trigger;
  }

  public unregisterTrigger(trigger: HTMLElement): void {
    if (this.triggerElement === trigger) {
      this.triggerElement = null;
    }
  }

  public registerPanel(panel: HTMLElement, id: string): void {
    this.panelElement = panel;
    this.panelElementId = id;
  }

  public unregisterPanel(panel: HTMLElement): void {
    if (this.panelElement === panel) {
      this.panelElement = null;
      this.panelElementId = null;
    }
  }

  public getPanelId(): string | null {
    return this.panelElementId;
  }

  public resolvePanelRole(): Exclude<TngPopoverPanelRole, 'none'> | null {
    const role = this.panelRole();
    return role === 'none' ? null : role;
  }

  private activatePopover(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    if (this.documentRef !== null) {
      this.documentRef.addEventListener('keydown', this.onDocumentKeydown, true);
      this.documentRef.addEventListener('pointerdown', this.onDocumentPointerdown, true);
    }

    this.focusInitialElement();
  }

  private deactivatePopover(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    if (this.documentRef !== null) {
      this.documentRef.removeEventListener('keydown', this.onDocumentKeydown, true);
      this.documentRef.removeEventListener('pointerdown', this.onDocumentPointerdown, true);
    }
  }

  private focusInitialElement(): void {
    if (this.autoFocus() === 'none') {
      return;
    }

    afterNextRender(
      (): void => {
        if (!this.isOpen()) {
          return;
        }

        const panel = this.panelElement;
        if (panel === null) {
          return;
        }

        if (this.autoFocus() === 'panel') {
          panel.focus();
          return;
        }

        const focusTarget = resolvePopoverMarkedInitialElement(panel) ?? resolvePopoverFocusableElements(panel)[0] ?? panel;
        focusTarget.focus();
      },
      { injector: this.injector },
    );
  }

  private restoreFocusToTrigger(): void {
    if (!this.restoreFocus()) {
      return;
    }

    afterNextRender(
      (): void => {
        const target = this.triggerElement ?? this.restoreFocusElement;
        if (target === null || !target.isConnected) {
          return;
        }

        target.focus();
      },
      { injector: this.injector },
    );
  }

  private handleDocumentKeydown(event: unknown): void {
    if (!this.isOpen() || !this.closeOnEscape()) {
      return;
    }

    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null || keyboardEvent.key !== 'Escape') {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  private handleDocumentPointerdown(event: unknown): void {
    if (!this.isOpen() || !this.closeOnOutsidePointer()) {
      return;
    }

    const target = readPopoverEventTarget(event);
    if (target === null) {
      return;
    }

    if (this.hostRef.nativeElement.contains(target)) {
      return;
    }

    this.requestClose('outside-pointer');
  }

  private setOpenState(next: boolean): void {
    if (this.isOpen() === next) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledOpen.set(next);
    }

    this.openChange.emit(next);
  }

  private isControlled(): boolean {
    return this.openInput() !== undefined;
  }
}

@Directive({
  selector: '[tngPopoverTrigger]',
  exportAs: 'tngPopoverTrigger',
  standalone: true,
})
export class TngPopoverTrigger implements OnDestroy, OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly parentPopover = inject(TngPopover, { optional: true });

  public readonly popoverFor = input<TngPopover | null>(null, {
    alias: 'tngPopoverTrigger',
  });

  @HostBinding('attr.aria-haspopup')
  protected get ariaHasPopupAttr(): TngPopoverAriaHasPopup {
    return this.resolvePopover()?.ariaHasPopup() ?? 'dialog';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    return this.resolvePopover()?.getPanelId() ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return this.resolvePopover()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-trigger';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.resolvePopover()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.resolvePopover()?.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.resolvePopover()?.disabled() ? '' : null;
  }

  public ngOnInit(): void {
    this.resolvePopover()?.registerTrigger(this.hostRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.resolvePopover()?.unregisterTrigger(this.hostRef.nativeElement);
  }

  @HostListener('click')
  protected onClick(): void {
    this.resolvePopover()?.togglePopover();
  }

  private resolvePopover(): TngPopover | null {
    return this.popoverFor() ?? this.parentPopover;
  }
}

@Directive({
  selector: '[tngPopoverPanel], [tngPopoverContent]',
  exportAs: 'tngPopoverPanel',
  standalone: true,
})
export class TngPopoverPanel implements OnDestroy, OnInit {
  private readonly popover = inject(TngPopover);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly generatedId = createPopoverPanelId();
  private resolvedId = '';

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-panel';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.popover.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.popover.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngPopoverSide {
    return this.popover.side();
  }

  @HostBinding('attr.data-align')
  protected get dataAlignAttr(): TngPopoverAlign {
    return this.popover.align();
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.popover.isOpen() ? null : '';
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.role')
  protected get roleAttr(): Exclude<TngPopoverPanelRole, 'none'> | null {
    return this.popover.resolvePanelRole();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.popover.ariaLabel();
  }

  @HostBinding('attr.tabindex')
  protected readonly tabIndexAttr = '-1';

  public ngOnInit(): void {
    const hostId = this.hostRef.nativeElement.id.trim();
    this.resolvedId = hostId.length > 0 ? hostId : this.generatedId;
    this.popover.registerPanel(this.hostRef.nativeElement, this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.popover.unregisterPanel(this.hostRef.nativeElement);
  }
}

@Directive({
  selector: '[tngPopoverClose]',
  exportAs: 'tngPopoverClose',
  standalone: true,
})
export class TngPopoverClose {
  private readonly popover = inject(TngPopover);

  public readonly closeReason = input<string | null>(null, {
    alias: 'tngPopoverClose',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-close';

  @HostListener('click')
  protected onClick(): void {
    this.popover.requestClose(this.resolveCloseReason());
  }

  private resolveCloseReason(): TngPopoverCloseReason {
    const raw = this.closeReason()?.trim();
    if (raw === undefined || raw.length === 0) {
      return 'programmatic';
    }

    return isPopoverCloseReason(raw) ? raw : 'programmatic';
  }
}
