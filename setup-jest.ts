import 'jest-preset-angular/setup-env/utils';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize TestBed
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

import './jest-global-mocks';
