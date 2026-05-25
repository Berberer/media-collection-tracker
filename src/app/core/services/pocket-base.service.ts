import { Injectable } from '@angular/core';
import PocketBase, { RecordService } from 'pocketbase';

import { environment } from '../../../environments/environment';
import { Collections, TypedPocketBase } from '../../../pocketbase-types';

@Injectable({ providedIn: 'root' })
export class PocketBaseService {
  private readonly pocketbase: TypedPocketBase | null;

  constructor() {
    if (environment.production) {
      this.pocketbase = new PocketBase();
    } else if (environment.backendUrl) {
      this.pocketbase = new PocketBase(environment.backendUrl);
    } else {
      this.pocketbase = null;
    }
  }

  public getRecordService<T>(recordType: Collections): RecordService<T> | null {
    return this.pocketbase ? this.pocketbase.collection(recordType) : null;
  }
}
