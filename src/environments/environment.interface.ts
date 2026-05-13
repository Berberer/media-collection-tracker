import { ModuleWithProviders } from '@angular/core';
import { NgxsConfig } from '@ngxs/store';

export interface Environment {
  production: boolean;
  appTitle: string;
  backendUrl?: string;
  imports: ModuleWithProviders<object>[];
  ngxsConfig: Partial<NgxsConfig>;
}
