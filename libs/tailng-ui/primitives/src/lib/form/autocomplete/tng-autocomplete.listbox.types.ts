import type { ComboboxListboxApi } from '../../internal/combobox';

/** Autocomplete listbox does not support typeahead (input owns typing/filtering). */
export type TngAutocompleteListboxApi = Omit<ComboboxListboxApi, 'typeahead'>;