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
import { createOverlayScrollLockManager, createTngIdFactory } from '@tailng-ui/cdk';
import type { TngScrollLockDocument } from '@tailng-ui/cdk/overlay';

const createDialogId = createTngIdFactory('tng-dialog');
const createDialogPanelId = createTngIdFactory('tng-dialog-panel');
const createDialogTitleId = createTngIdFactory('tng-dialog-title');
const createDialogDescriptionId = createTngIdFactory('tng-dialog-description');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type TngDialogAutoFocus = 'dialog' | 'first-focusable' | 'none';
export type TngDialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';
export type TngDialogSize = 'lg' | 'md' | 'sm';

type OptionalBooleanInput = boolean | null | string | undefined;
type TngDialogFocusTrapState = Readonly<{
  activeElement: HTMLElement | null;
  first: HTMLElement;
  last: HTMLElement;
  panel: HTMLElement;
}>;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function toScrollLockDocument(documentRef: unknown): TngScrollLockDocument | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngScrollLockDocument;
}

export function resolveTngDialogActiveElement(documentRef: unknown): HTMLElement | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  const activeElement = documentRef.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

export function resolveTngDialogFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  const candidates = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  const focusableElements: HTMLElement[] = [];
  for (const candidate of candidates) {
    if (!candidate.hasAttribute('disabled')) {
      focusableElements.push(candidate);
    }
  }

  return focusableElements;
}

export function resolveTngDialogMarkedInitialElement(container: unknown): HTMLElement | null {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-dialog-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolveTngDialogFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolveTngDialogFocusableElements(markedInitial)[0] ?? null;
}

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

function resolveFirstFocusableWithin(container: unknown): HTMLElement | null {
  return resolveTngDialogFocusableElements(container)[0] ?? null;
}

function isDialogCloseReason(value: string): value is TngDialogCloseReason {
  return value === 'backdrop' || value === 'close-button' || value === 'escape' || value === 'programmatic';
}

@Directive({
  selector: '[tngDialog]',
  exportAs: 'tngDialog',
  standalone: true,
})
export class TngDialog implements OnDestroy, OnInit {
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
  public readonly dismissible = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnBackdropClick = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly autoFocus = input<TngDialogAutoFocus, TngDialogAutoFocus | string>('first-focusable', {
    transform: (value: TngDialogAutoFocus | string): TngDialogAutoFocus => {
      return value === 'none' || value === 'dialog' || value === 'first-focusable'
        ? value
        : 'first-focusable';
    },
  });
  public readonly trapFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly lockScroll = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedby = input<string | null>(null);
  public readonly size = input<TngDialogSize>('md');

  public readonly openChange = output<boolean>();
  public readonly closed = output<TngDialogCloseReason>();

  private readonly documentRef = typeof document === 'undefined' ? null : document;
  private readonly injector = inject(Injector);
  private readonly instanceId = createDialogId();
  private readonly scrollLock = createOverlayScrollLockManager({
    documentRef: toScrollLockDocument(this.documentRef),
  });

  private readonly uncontrolledOpen = signal(false);
  private readonly openStateEffect = effect((): void => {
    if (!this.initialized) {
      return;
    }

    if (this.isOpen()) {
      this.activateDialog();
      return;
    }

    this.deactivateDialog();
  });

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    this.handleDocumentKeydown(event);
  };

  private initialized = false;
  private isActive = false;
  private panelElement: HTMLElement | null = null;
  private panelElementId: string | null = null;
  private registeredTitleId: string | null = null;
  private registeredDescriptionId: string | null = null;
  private restoreFocusElement: HTMLElement | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog';

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

  @HostBinding('attr.data-size')
  protected get dataSizeAttr(): TngDialogSize {
    return this.size();
  }

  public ngOnInit(): void {
    if (!this.isControlled()) {
      this.uncontrolledOpen.set(this.defaultOpen());
    }

    this.initialized = true;
    if (this.isOpen()) {
      this.activateDialog();
    }
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivateDialog();
  }

  public isOpen(): boolean {
    return this.openInput() ?? this.uncontrolledOpen();
  }

  public openDialog(): void {
    if (this.disabled()) {
      return;
    }

    this.setOpenState(true);
  }

  public closeDialog(reason: TngDialogCloseReason = 'programmatic'): void {
    this.requestClose(reason);
  }

  public toggleDialog(force?: boolean): void {
    if (force !== undefined) {
      if (force) {
        this.openDialog();
        return;
      }

      this.closeDialog('programmatic');
      return;
    }

    if (this.isOpen()) {
      this.closeDialog('programmatic');
      return;
    }

    this.openDialog();
  }

  public requestClose(reason: TngDialogCloseReason): void {
    if (!this.isOpen()) {
      return;
    }

    this.closed.emit(reason);
    this.setOpenState(false);
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

  public registerTitle(id: string): void {
    this.registeredTitleId = id;
  }

  public unregisterTitle(id: string): void {
    if (this.registeredTitleId === id) {
      this.registeredTitleId = null;
    }
  }

  public registerDescription(id: string): void {
    this.registeredDescriptionId = id;
  }

  public unregisterDescription(id: string): void {
    if (this.registeredDescriptionId === id) {
      this.registeredDescriptionId = null;
    }
  }

  public getPanelId(): string | null {
    return this.panelElementId;
  }

  public resolveAriaLabelledby(): string | null {
    const explicit = this.ariaLabelledby()?.trim() ?? '';
    if (explicit.length > 0) {
      return explicit;
    }

    return this.registeredTitleId;
  }

  public resolveAriaDescribedby(): string | null {
    const explicit = this.ariaDescribedby()?.trim() ?? '';
    if (explicit.length > 0) {
      return explicit;
    }

    return this.registeredDescriptionId;
  }

  public onBackdropPointerDown(event: PointerEvent): void {
    if (!this.shouldCloseFromBackdrop()) {
      return;
    }

    if (!(event.currentTarget instanceof HTMLElement)) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    this.requestClose('backdrop');
  }

  public trapTabNavigation(event: unknown): void {
    if (!this.trapFocus()) {
      return;
    }

    const panel = this.panelElement;
    if (panel === null) {
      return;
    }

    const focusState = this.resolveFocusTrapState(panel);
    if (focusState === null) {
      return;
    }

    if (this.focusEdgeWhenOutsidePanel(event, focusState)) {
      return;
    }

    this.wrapTabAtEdges(event, focusState);
  }

  private activateDialog(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.restoreFocusElement = this.restoreFocus() ? resolveTngDialogActiveElement(this.documentRef) : null;

    if (this.lockScroll()) {
      this.scrollLock.acquire(this.instanceId);
    }

    this.documentRef?.addEventListener('keydown', this.onDocumentKeydown, true);

    afterNextRender(
      (): void => {
        this.focusInitialElement();
      },
      { injector: this.injector },
    );
  }

  private deactivateDialog(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    this.documentRef?.removeEventListener('keydown', this.onDocumentKeydown, true);

    if (this.lockScroll()) {
      this.scrollLock.release(this.instanceId);
    }

    if (this.restoreFocus() && this.restoreFocusElement !== null) {
      this.restoreFocusElement.focus();
    }

    this.restoreFocusElement = null;
  }

  private focusInitialElement(): void {
    if (!this.isOpen()) {
      return;
    }

    const panel = this.panelElement;
    if (panel === null) {
      return;
    }

    if (this.autoFocus() === 'none') {
      return;
    }

    if (this.autoFocus() === 'dialog') {
      panel.focus();
      return;
    }

    const markedInitial = resolveTngDialogMarkedInitialElement(panel);
    if (markedInitial !== null) {
      markedInitial.focus();
      return;
    }

    const firstFocusable = resolveFirstFocusableWithin(panel);
    if (firstFocusable !== null) {
      firstFocusable.focus();
      return;
    }

    panel.focus();
  }

  private focusEdgeWhenOutsidePanel(event: unknown, focusState: TngDialogFocusTrapState): boolean {
    const activeElement = focusState.activeElement;
    if (activeElement !== null && focusState.panel.contains(activeElement)) {
      return false;
    }

    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return true;
    }

    const edge = keyboardEvent.shiftKey ? focusState.last : focusState.first;
    keyboardEvent.preventDefault();
    edge.focus();
    return true;
  }

  private handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen() || event.key !== 'Escape') {
      return;
    }

    if (!this.shouldCloseFromEscape()) {
      return;
    }

    event.preventDefault();
    this.requestClose('escape');
  }

  private isControlled(): boolean {
    return this.openInput() !== undefined;
  }

  private resolveFocusTrapState(panel: HTMLElement): TngDialogFocusTrapState | null {
    const focusableElements = resolveTngDialogFocusableElements(panel);
    const first = focusableElements[0];
    if (first === undefined) {
      return null;
    }

    return {
      activeElement: resolveTngDialogActiveElement(this.documentRef),
      first,
      last: focusableElements[focusableElements.length - 1] ?? first,
      panel,
    };
  }

  private setOpenState(nextOpen: boolean): void {
    if (nextOpen && this.disabled()) {
      return;
    }

    if (this.isOpen() === nextOpen) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledOpen.set(nextOpen);
    }

    this.openChange.emit(nextOpen);
  }

  private shouldCloseFromBackdrop(): boolean {
    return this.isOpen() && this.dismissible() && this.closeOnBackdropClick();
  }

  private shouldCloseFromEscape(): boolean {
    return this.isOpen() && this.dismissible() && this.closeOnEscape();
  }

  private wrapTabAtEdges(event: unknown, focusState: TngDialogFocusTrapState): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    const activeElement = focusState.activeElement;
    if (activeElement === focusState.first && keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      focusState.last.focus();
      return;
    }

    if (activeElement === focusState.last && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      focusState.first.focus();
    }
  }
}

@Directive({
  selector: '[tngDialogPanel]',
  exportAs: 'tngDialogPanel',
  standalone: true,
})
export class TngDialogPanel implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogPanelId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-panel';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.dialog.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-size')
  protected get dataSizeAttr(): TngDialogSize {
    return this.dialog.size();
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.dialog.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.dialog.isOpen() ? null : '';
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'dialog';

  @HostBinding('attr.tabindex')
  protected readonly tabindexAttr = '-1';

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return this.dialog.resolveAriaDescribedby();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    const label = this.dialog.ariaLabel()?.trim() ?? '';
    return label.length > 0 ? label : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledByAttr(): string | null {
    return this.dialog.resolveAriaLabelledby();
  }

  @HostBinding('attr.aria-modal')
  protected get ariaModalAttr(): 'true' | null {
    return this.dialog.isOpen() ? 'true' : null;
  }

  public ngOnInit(): void {
    this.dialog.registerPanel(this.hostRef.nativeElement, this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterPanel(this.hostRef.nativeElement);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.dialog.trapTabNavigation(event);
    }
  }
}

@Directive({
  selector: '[tngDialogBackdrop]',
  exportAs: 'tngDialogBackdrop',
  standalone: true,
})
export class TngDialogBackdrop {
  private readonly dialog = inject(TngDialog);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-backdrop';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.dialog.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.dialog.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.dialog.isOpen() ? null : '';
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    this.dialog.onBackdropPointerDown(event);
  }
}

@Directive({
  selector: '[tngDialogTrigger]',
  exportAs: 'tngDialogTrigger',
  standalone: true,
})
export class TngDialogTrigger {
  private readonly parentDialog = inject(TngDialog, { optional: true });

  public readonly dialogFor = input<TngDialog | null>(null, {
    alias: 'tngDialogTrigger',
  });

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHasPopupAttr = 'dialog';

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    return this.resolveDialog()?.getPanelId() ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return this.resolveDialog()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-trigger';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.resolveDialog()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.resolveDialog()?.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.resolveDialog()?.disabled() ? '' : null;
  }

  @HostListener('click')
  protected onClick(): void {
    this.resolveDialog()?.openDialog();
  }

  private resolveDialog(): TngDialog | null {
    return this.dialogFor() ?? this.parentDialog;
  }
}

@Directive({
  selector: '[tngDialogTitle]',
  exportAs: 'tngDialogTitle',
  standalone: true,
})
export class TngDialogTitle implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogTitleId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-title';

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  public ngOnInit(): void {
    this.dialog.registerTitle(this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterTitle(this.resolvedId);
  }
}

@Directive({
  selector: '[tngDialogDescription]',
  exportAs: 'tngDialogDescription',
  standalone: true,
})
export class TngDialogDescription implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogDescriptionId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-description';

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  public ngOnInit(): void {
    this.dialog.registerDescription(this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterDescription(this.resolvedId);
  }
}

@Directive({
  selector: '[tngDialogContent]',
  exportAs: 'tngDialogContent',
  standalone: true,
})
export class TngDialogContent {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-content';
}

@Directive({
  selector: '[tngDialogActions]',
  exportAs: 'tngDialogActions',
  standalone: true,
})
export class TngDialogActions {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-actions';
}

@Directive({
  selector: '[tngDialogClose]',
  exportAs: 'tngDialogClose',
  standalone: true,
})
export class TngDialogClose {
  private readonly dialog = inject(TngDialog);

  public readonly closeReason = input<string | null>(null, {
    alias: 'tngDialogClose',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-close';

  @HostListener('click')
  protected onClick(): void {
    this.dialog.requestClose(this.resolveCloseReason());
  }

  private resolveCloseReason(): TngDialogCloseReason {
    const raw = this.closeReason()?.trim();
    if (raw === undefined || raw.length === 0) {
      return 'close-button';
    }

    return isDialogCloseReason(raw) ? raw : 'close-button';
  }
}
