import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-autocomplete-search',
  imports: [FormsModule],
  templateUrl: './autocomplete-search.component.html',
  styleUrl: 'autocomplete-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteSearchComponent),
      multi: true,
    },
  ],
})
export class AutocompleteSearchComponent implements ControlValueAccessor {
  readonly options = input.required<string[]>();

  protected readonly = signal<boolean>(false);
  protected value = signal<string | null>(null);

  protected onChangeFunction: (value: string | null) => void = () => {};
  private onTouchedFunction: () => void = () => {};

  onChange(value: Parameters<typeof this.writeValue>[0]): void {
    if (this.onChangeFunction) {
      this.value.set(value);
      this.onChangeFunction(value);
    }
  }

  writeValue(value: string | null): void {
    this.value.set(value);
  }

  registerOnChange(
    fn: (value: Parameters<typeof this.writeValue>[0]) => void,
  ): void {
    this.onChangeFunction = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFunction = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly.set(isDisabled);
  }
}
