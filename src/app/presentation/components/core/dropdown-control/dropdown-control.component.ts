import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
  model,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgClass, FormsModule],
})
export class DropdownControlComponent<T> implements FormValueControl<T | undefined> {
  readonly value = model<T>();
  readonly disabled = model(false);
  readonly readonly = model(false);
  readonly dirty = model(false);
  readonly touched = model(false);

  readonly items = input.required<readonly T[]>();
  readonly itemTemplate = contentChild.required(TemplateRef<{ $implicit: T }>);
  readonly searchable = input(false);
  readonly itemLabelMapper = input.required<(item: T) => string>();
  readonly itemTracker = input<(item: T) => string | number | undefined>(this.defaultTracker);

  readonly searchQueryInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  readonly searchQuery = model('');
  readonly filteredItems = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const items = this.items();

    if (!this.searchable() || !query) {
      return items;
    }

    return items.filter((item) => this.itemLabelMapper()(item).toLowerCase().includes(query));
  });

  onOpenDropdown(): void {
    this.searchQuery.set('');
    if (this.searchable()) {
      setTimeout(() => {
        this.searchQueryInput().nativeElement.focus();
      }, 100);
    }
  }

  onSelectItem(item: T): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (this.isClonable(item)) {
      this.value.set(item.clone());
    } else {
      this.value.set(item);
    }
    this.dirty.set(true);
    this.touched.set(true);
  }

  private isClonable<T>(item: T): item is T & { clone(): T } {
    return typeof (item as { clone?: () => T }).clone === 'function';
  }

  private defaultTracker(this: void, item: T): string | number | undefined {
    if (item === null || item === undefined) {
      return undefined;
    } else if (typeof item === 'string' || typeof item === 'number') {
      return item;
    } else if (
      typeof item === 'object' &&
      'id' in item &&
      (typeof item.id === 'string' || typeof item.id === 'number')
    ) {
      return item.id;
    } else {
      throw new Error(
        `Invalid item type: ${typeof item}. Default tracking function is expecting string, number, or object with 'id' property.`,
      );
    }
  }
}
