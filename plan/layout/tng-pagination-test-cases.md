# TngPagination Test Cases

This checklist covers possible test scenarios for the `tngPagination` primitive directives, grouped by feature category. Each item is intentionally written as a one-line test description so it can be converted into Vitest `it(...)` blocks easily.

## 1. Root Directive Rendering

- Should render the pagination root with `data-slot="pagination"`.
- Should apply the configured `aria-label` to the root element.
- Should remove `aria-label` when `ariaLabel` is `null`.
- Should expose the current page index through `data-page-index`.
- Should expose the current page size through `data-page-size`.
- Should expose the computed page count through `data-page-count`.
- Should expose the current mode through a root data attribute if the API supports it.
- Should expose disabled state through `data-disabled` or equivalent state attribute.
- Should update root state attributes when inputs change after initial render.
- Should not throw when projected controls are missing.
- Should support usage on semantic `nav` elements.
- Should support usage on non-`nav` host elements if the directive allows it.

## 2. Default / Uncontrolled State

- Should initialize with `defaultPageIndex` when `pageIndex` is uncontrolled.
- Should initialize with `defaultPageSize` when `pageSize` is uncontrolled.
- Should fallback to page index `0` when no default page index is provided.
- Should fallback to the default page size when no default page size is provided.
- Should clamp an initial uncontrolled page index below `0` to `0`.
- Should clamp an initial uncontrolled page index above the last client page to the last page.
- Should preserve uncontrolled internal page index after navigation.
- Should preserve uncontrolled internal page size after page-size selection.
- Should not reset uncontrolled state on unrelated input changes.
- Should reset or clamp uncontrolled page index when `totalItems` decreases below the current range.
- Should keep current uncontrolled page index when `totalItems` increases and the page remains valid.

## 3. Controlled Page Index

- Should use controlled `pageIndex` when provided by the host.
- Should emit `pageIndexChange` when a controlled page navigation is requested.
- Should not mutate rendered page index in controlled mode until the host syncs the value.
- Should update rendered page index after the host syncs the controlled value.
- Should clamp controlled page index below `0` for client mode rendering.
- Should clamp controlled page index above the last page for client mode rendering.
- Should preserve controlled page index when unrelated inputs change.
- Should switch from uncontrolled to controlled page index when `pageIndex` becomes defined.
- Should switch from controlled to uncontrolled page index when `pageIndex` becomes `undefined`.
- Should not emit duplicate `pageIndexChange` when navigating to the already-current page.
- Should emit previous page index correctly from controlled state.

## 4. Controlled Page Size

- Should use controlled `pageSize` when provided by the host.
- Should emit `pageSizeChange` when a controlled page-size change is requested.
- Should not mutate rendered page size in controlled mode until the host syncs the value.
- Should update rendered page size after the host syncs the controlled value.
- Should switch from uncontrolled to controlled page size when `pageSize` becomes defined.
- Should switch from controlled to uncontrolled page size when `pageSize` becomes `undefined`.
- Should not emit duplicate `pageSizeChange` when selecting the already-current page size.
- Should recompute page count from controlled page size.
- Should clamp page index after a controlled page-size sync reduces the page count.
- Should keep the first visible item anchored when controlled page size is eventually synced.

## 5. Page Count Calculation

- Should calculate page count as `ceil(totalItems / pageSize)` in client mode.
- Should calculate page count as `0` when `totalItems` is `0` if that is the chosen contract.
- Should calculate page count as `1` when empty pagination still exposes one logical page if that is the chosen contract.
- Should update page count when `totalItems` changes.
- Should update page count when `pageSize` changes.
- Should handle totals smaller than the page size.
- Should handle totals exactly divisible by the page size.
- Should handle totals not divisible by the page size.
- Should handle very large `totalItems` values.
- Should handle invalid or zero page size according to the chosen fallback contract.
- Should handle negative `totalItems` according to the chosen clamp contract.

## 6. First Button

- Should render first-page control with `data-slot="pagination-first"` if supported.
- Should disable the first button on the first page.
- Should enable the first button when the current page is not the first page.
- Should navigate to page index `0` when clicked.
- Should emit `pageIndexChange` with `0` when clicked from another page.
- Should emit `pageChange` with trigger `first` when clicked from another page.
- Should include the correct `previousPageIndex` when first is clicked.
- Should not emit when clicked while already on the first page.
- Should not emit when clicked while pagination is disabled.
- Should keep the first button disabled when there is only one page.

## 7. Previous Button

- Should render previous-page control with `data-slot="pagination-previous"` if supported.
- Should disable previous button on the first page.
- Should enable previous button after navigating away from the first page.
- Should decrement page index by one when clicked.
- Should emit `pageIndexChange` with the previous page index.
- Should emit `pageChange` with trigger `previous`.
- Should include the correct `previousPageIndex` in the event.
- Should clamp previous navigation at page index `0`.
- Should not emit when clicked on the first page.
- Should not emit when clicked while pagination is disabled.

## 8. Next Button

- Should render next-page control with `data-slot="pagination-next"` if supported.
- Should enable next button on the first page when more pages exist.
- Should increment page index by one when clicked.
- Should emit `pageIndexChange` with the next page index.
- Should emit `pageChange` with trigger `next`.
- Should include the correct `previousPageIndex` in the event.
- Should disable next button on the last page in client mode.
- Should clamp next navigation at the last page in client mode.
- Should not emit when clicked on the last page in client mode.
- Should not emit when clicked while pagination is disabled.
- Should remain enabled in server mode when requesting unknown future pages if that is the chosen contract.

## 9. Last Button

- Should render last-page control with `data-slot="pagination-last"` if supported.
- Should disable last button on the last page.
- Should enable last button before the last page.
- Should navigate to the final client page when clicked.
- Should emit `pageIndexChange` with the last page index.
- Should emit `pageChange` with trigger `last`.
- Should include the correct `previousPageIndex` in the event.
- Should not emit when clicked while already on the last page.
- Should not emit when clicked while pagination is disabled.
- Should be disabled when there is only one page.
- Should be hidden or disabled in server mode if no known final page exists, according to the chosen contract.

## 10. Explicit Page Buttons

- Should render explicit page controls with `data-slot="pagination-page"` if supported.
- Should mark the current page button with `aria-current="page"`.
- Should remove `aria-current` from non-current page buttons.
- Should update `aria-current` after navigation.
- Should navigate to the configured page index when clicked.
- Should emit `pageIndexChange` with the clicked page index.
- Should emit `pageChange` with trigger `page`.
- Should not emit when clicking the already-current page button.
- Should disable page buttons when pagination is disabled.
- Should disable or ignore page buttons outside the known client page range.
- Should support page button index `0` as the first page.
- Should support dynamic changes to a page button's `[tngPaginationPage]` value.
- Should preserve host-provided text content inside page buttons.

## 11. Page Size Select

- Should render page-size control with `data-slot="pagination-page-size"` if supported.
- Should initialize the select value from the current page size.
- Should update page size when the select value changes.
- Should emit `pageSizeChange` when a new page size is selected.
- Should emit `pageChange` with trigger `size` when page size changes.
- Should include the new `pageSize` in the emitted event.
- Should include the recalculated `pageIndex` in the emitted event.
- Should keep the first visible item anchored when page size changes.
- Should clamp the recalculated page index to the last page in client mode.
- Should not emit when selecting the already-current page size.
- Should not emit when pagination is disabled.
- Should ignore non-numeric select values according to the chosen fallback contract.
- Should update select value when controlled page size changes from the host.
- Should support page-size options projected by the host.

## 12. Client Mode Navigation

- Should clamp all navigation within the known client page range.
- Should disable next and last controls on the final page.
- Should disable previous and first controls on the first page.
- Should update controls correctly after `totalItems` changes.
- Should move to the last valid page when current page becomes out of range.
- Should not allow navigation past the last page.
- Should calculate the last page from `totalItems` and `pageSize`.
- Should emit events with mode `client`.
- Should keep page buttons outside range inactive if they are projected.
- Should handle single-page client pagination with all movement controls disabled.

## 13. Server Mode Navigation

- Should allow next navigation beyond the known client page count if server mode permits unknown pages.
- Should emit events with mode `server`.
- Should not clamp next navigation to `totalItems` in server mode if total is advisory.
- Should preserve previous navigation behavior in server mode.
- Should prevent previous navigation below page index `0` in server mode.
- Should define whether first navigation remains available in server mode.
- Should define whether last navigation is disabled when the true last page is unknown.
- Should support known totals in server mode when the backend provides total count.
- Should update page count display when server total changes.
- Should keep emitted page requests stable even when rendered page count is unknown.

## 14. Disabled State

- Should disable all pagination buttons when root disabled is true.
- Should disable the page-size select when root disabled is true.
- Should expose disabled state on the root.
- Should not emit `pageChange` when disabled.
- Should not emit `pageIndexChange` when disabled.
- Should not emit `pageSizeChange` when disabled.
- Should preserve current page index while disabled.
- Should preserve current page size while disabled.
- Should resume navigation correctly after disabled changes back to false.
- Should combine disabled state with boundary disabled state correctly.
- Should not override a control that is already disabled by the host if host-disabled controls are supported.

## 15. Event Payloads

- Should emit `pageChange` for page index changes.
- Should emit `pageChange` for page size changes.
- Should include `pageIndex` in every page-change event.
- Should include `previousPageIndex` in every page index change event.
- Should include `pageSize` in every page-change event.
- Should include `totalItems` in every page-change event if the event contract includes it.
- Should include `pageCount` in every page-change event if the event contract includes it.
- Should include `mode` in every page-change event.
- Should include trigger `first` for first-button navigation.
- Should include trigger `previous` for previous-button navigation.
- Should include trigger `next` for next-button navigation.
- Should include trigger `last` for last-button navigation.
- Should include trigger `page` for explicit page-button navigation.
- Should include trigger `size` for page-size changes.
- Should emit `pageIndexChange` before or after `pageChange` according to the documented event order.
- Should emit `pageSizeChange` before or after `pageChange` according to the documented event order.
- Should not emit partial events when requested navigation is ignored.

## 16. Boundary Conditions

- Should handle `totalItems = 0`.
- Should handle `totalItems = 1`.
- Should handle `totalItems` equal to `pageSize`.
- Should handle `totalItems` one greater than `pageSize`.
- Should handle page size larger than total items.
- Should handle page size of `1`.
- Should handle very large page sizes.
- Should handle very large page indexes in client mode by clamping.
- Should handle very large page indexes in server mode according to server-mode contract.
- Should handle negative page indexes by clamping or rejecting according to contract.
- Should handle negative page sizes by fallback or rejection according to contract.
- Should handle `NaN` page size from native select parsing according to contract.
- Should handle decimal page sizes according to contract.
- Should handle decimal page indexes according to contract.

## 17. Dynamic Input Updates

- Should update controls when `disabled` changes.
- Should update controls when `mode` changes.
- Should update page count when `totalItems` changes.
- Should update page count when `pageSize` changes.
- Should update current page state when `pageIndex` changes.
- Should update current page state when `defaultPageIndex` changes before interaction if that is supported.
- Should ignore `defaultPageIndex` changes after uncontrolled interaction if that is the chosen contract.
- Should update uncontrolled page size when `defaultPageSize` changes before interaction if that is supported.
- Should ignore `defaultPageSize` changes after uncontrolled interaction if that is the chosen contract.
- Should update `aria-label` when `ariaLabel` changes.
- Should clamp page index after reducing `totalItems`.
- Should keep page index stable after increasing `totalItems`.
- Should update projected page-button current state after input changes.

## 18. Accessibility

- Should support an accessible label on the pagination root.
- Should preserve host-provided button labels for screen readers.
- Should mark only one page button as `aria-current="page"`.
- Should not mark movement controls as `aria-current`.
- Should remove `aria-current` when a page button is no longer current.
- Should use native disabled state for disabled buttons.
- Should use native disabled state for disabled select controls.
- Should keep focus behavior native when buttons are clicked.
- Should not trap focus inside pagination.
- Should allow keyboard activation through native button semantics.
- Should allow keyboard page-size changes through native select semantics.
- Should not require JavaScript-only ARIA roles that duplicate native semantics unnecessarily.
- Should support custom `aria-label` values for individual controls if projected by host.

## 19. Data Slot / Styling Contract

- Should assign stable `data-slot` values to the root and controls.
- Should assign stable state attributes for current page state.
- Should assign stable state attributes for disabled state.
- Should assign stable state attributes for boundary state if supported.
- Should not remove host-provided classes from root or controls.
- Should not remove host-provided data attributes from root or controls.
- Should not override host-provided IDs on root or controls.
- Should keep styling state attributes in sync after navigation.
- Should keep styling state attributes in sync after page-size changes.
- Should keep styling state attributes in sync after controlled host updates.

## 20. Projection / Registration

- Should register projected first control with the root pagination directive.
- Should register projected previous control with the root pagination directive.
- Should register projected next control with the root pagination directive.
- Should register projected last control with the root pagination directive.
- Should register projected page controls with the root pagination directive.
- Should register projected page-size control with the root pagination directive.
- Should unregister controls when projected controls are removed by conditional rendering.
- Should register controls when projected controls are added after initial render.
- Should support multiple page buttons.
- Should define behavior when multiple first controls are projected.
- Should define behavior when multiple page-size controls are projected.
- Should not leak registrations after fixture destruction.

## 21. Form Integration

- Should work inside a regular Angular form without interfering with form submission.
- Should ensure pagination buttons use `type="button"` or require host to provide it to avoid accidental form submit.
- Should not mark a parent form dirty when only navigation buttons are clicked.
- Should update native select value correctly inside a form.
- Should work with reactive forms surrounding the pagination region.
- Should work with template-driven forms surrounding the pagination region.

## 22. Change Detection / Signals

- Should update rendered state after signal input changes and `detectChanges`.
- Should not require manual directive method calls to sync state.
- Should avoid duplicate emissions during a single click interaction.
- Should avoid duplicate emissions during a single page-size change interaction.
- Should support auto-sync host patterns where output handlers immediately update controlled inputs.
- Should render the synced controlled value in the same change-detection cycle after auto-sync.
- Should avoid Angular expression-changed errors during output-driven sync.
- Should clean up effects or subscriptions on fixture destroy.

## 23. Auto-Sync Host Pattern

- Should update controlled page index immediately when the host auto-syncs `pageIndexChange`.
- Should update controlled page size immediately when the host auto-syncs `pageSizeChange`.
- Should emit one page-change event when auto-syncing page index.
- Should emit one page-change event when auto-syncing page size.
- Should keep root attributes consistent after auto-sync.
- Should keep control disabled states consistent after auto-sync.
- Should preserve the correct previous page index during auto-sync.

## 24. Native Event Handling

- Should respond to bubbled click events from pagination buttons.
- Should ignore click events from disabled native buttons.
- Should respond to native select `change` events.
- Should not require a custom event type for page-size selection.
- Should call `preventDefault` only if the directive contract requires it.
- Should not stop event propagation unless the directive contract requires it.
- Should ignore events when the control is detached from a pagination root.

## 25. Error Handling / Invalid Usage

- Should not throw when a page control is used without a root if standalone usage is allowed.
- Should throw a clear error when a page control is used without a root if root is required.
- Should not throw when `totalItems` is temporarily undefined if input typing allows it.
- Should not throw when `pageSize` is temporarily undefined in uncontrolled mode.
- Should not throw when `pageIndex` is temporarily undefined in uncontrolled mode.
- Should handle invalid page button values according to contract.
- Should handle invalid mode values only at compile time when the input is strongly typed.
- Should expose clear behavior for zero or invalid page size.

## 26. Regression Tests From Current Spec

- Should render root state and disable previous controls on the first page.
- Should move through pages in uncontrolled mode.
- Should clamp client navigation to the last page.
- Should emit controlled changes without mutating rendered page until the host syncs.
- Should allow server mode to request pages past the known client count.
- Should update page size and keep the first visible item anchored.
- Should not emit when disabled.

## 27. Recommended Additional High-Value Tests

- Should verify event order for `pageIndexChange`, `pageSizeChange`, and `pageChange`.
- Should verify auto-sync controlled behavior for both page index and page size.
- Should verify dynamic reduction of `totalItems` clamps the current page.
- Should verify single-page pagination disables all movement controls.
- Should verify zero-items pagination behavior matches the documented contract.
- Should verify projected page buttons update `aria-current` after every navigation trigger.
- Should verify server mode does not incorrectly disable next after reaching known page count.
- Should verify page-size change from page `2` with size `10` to size `20` anchors item offset correctly.
- Should verify no duplicate emissions occur when clicking disabled or boundary controls.
- Should verify cleanup by destroying the fixture after dynamic projection changes.

