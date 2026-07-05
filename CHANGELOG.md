# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/Berberer/media-collection-tracker/compare/v0.1.10...v0.2.0) (2026-07-05)

### Features

- add dedicated scripts for creating different release types ([98d33bd](https://github.com/Berberer/media-collection-tracker/commit/98d33bd388b21f74213e875cf60238c803785cbb))
- add series details page ([bda3931](https://github.com/Berberer/media-collection-tracker/commit/bda3931a416e16b1b036024fcf342d5eefffc83b))
- Angular v22 and TypeScript v6 updates ([a429367](https://github.com/Berberer/media-collection-tracker/commit/a429367cf6a326b46fa05161740879540947a0b0))
- create title service for updating browser and nav bar titles centrally ([e5a385c](https://github.com/Berberer/media-collection-tracker/commit/e5a385c225563572efc31f303f4c81c8d36042d7))
- show series properties and tags in collapse header of collected volume page ([80d021b](https://github.com/Berberer/media-collection-tracker/commit/80d021bbce6d782c2b28ca4be6a97316e2d20157))

### Bug Fixes

- only show incomplete series for selection in volume creation form ([d681515](https://github.com/Berberer/media-collection-tracker/commit/d6815157c31d1d2022b291704b1400addf14c76e))
- prevent user from adding a second volume to a single-volume series ([587436d](https://github.com/Berberer/media-collection-tracker/commit/587436da1a5522ad894de9fad995e41e88faf7a9))

### [0.1.10](https://github.com/Berberer/media-collection-tracker/compare/v0.1.9...v0.1.10) (2026-06-04)

### Features

- implement global error handler for showing error toasts in case of unhandled feature errors ([f36f557](https://github.com/Berberer/media-collection-tracker/commit/f36f5574f2d2afc074fa1488103cf3457d1932a8))
- set next sequence number for creating a volume when selecting a series ([5fa12d3](https://github.com/Berberer/media-collection-tracker/commit/5fa12d3d733ab0e0bc57fab100f11f5fe8456897))

### Bug Fixes

- add missing event handler for marking upcoming volume as bought ([67a2964](https://github.com/Berberer/media-collection-tracker/commit/67a2964e809383fa25ca75f51392a0d619831526))
- layout of series tooltip in volumes table ([3ce1528](https://github.com/Berberer/media-collection-tracker/commit/3ce152849b9ac6a303f8fc1b7fcd5571db94dbac))
- select 30 days as default time frame for filtering upcoming volumes ([b9a2118](https://github.com/Berberer/media-collection-tracker/commit/b9a211867eae06a80a4546175a32a5574597f59f))
- use proper app titles ([05b0706](https://github.com/Berberer/media-collection-tracker/commit/05b07060fc90230e091fa8fef0f76c6ef8227f57))

### [0.1.9](https://github.com/Berberer/media-collection-tracker/compare/v0.1.7...v0.1.9) (2026-05-30)

### Features

- add feature error handling system and implement error handling for duplicate tag creation ([913222e](https://github.com/Berberer/media-collection-tracker/commit/913222ed90feae6521b051cff928b8be53fdfca8))
- add import order to linting ([5e508b3](https://github.com/Berberer/media-collection-tracker/commit/5e508b30ed7da88cc3f8df1ed04d60a9b1c73f9f))
- add standard-version for tracking changes of releases ([8bb9f17](https://github.com/Berberer/media-collection-tracker/commit/8bb9f17553cceb17b6c91bbb1afe9dde5d69672c))
- replace default angular favicon with a simple custom icon ([8266e04](https://github.com/Berberer/media-collection-tracker/commit/8266e04fa90880c92adb3aa241a9df5423761fd7))

### Bug Fixes

- add missing dialog for marking missing volumes as bought on volumes tracking dashboard page ([2e885e0](https://github.com/Berberer/media-collection-tracker/commit/2e885e07509a7afa02fff797ee5fd13889dbfaca))
- correct create series loading spinner behavior ([f5297d6](https://github.com/Berberer/media-collection-tracker/commit/f5297d66d76772f7a0ec8dcd1dbf01a48bfbb77f))
- filter tabs hover above data instead of being below ([1bf4ac7](https://github.com/Berberer/media-collection-tracker/commit/1bf4ac799e8e9e1334601561f0f5bf39731aade8))
- modal correctly keeps dimensions when switching to loading ([70c2447](https://github.com/Berberer/media-collection-tracker/commit/70c2447c2347c6f2c876d84638b346857795c66b))
- prevent series card avatars being cut off horizontally ([e979ea8](https://github.com/Berberer/media-collection-tracker/commit/e979ea89453a70927df56d0397addf3c4bfb196d))

## [0.1.8](https://github.com/Berberer/media-collection-tracker/compare/v0.1.7...v0.1.8) (2026-05-22)

### Features

- add standard-version for tracking changes of releases ([8bb9f175](https://github.com/Berberer/media-collection-tracker/commit/8bb9f17553cceb17b6c91bbb1afe9dde5d69672c))

### Bug Fixes

- add missing dialog for marking missing volumes as bought on volumes tracking dashboard page ([2e885e07](https://github.com/Berberer/media-collection-tracker/commit/2e885e07509a7afa02fff797ee5fd13889dbfaca))

### Chore

- update dependencies ([e0870bb](https://github.com/Berberer/media-collection-tracker/commit/e0870bb))

## [0.1.7](https://github.com/Berberer/media-collection-tracker/compare/v0.1.6...v0.1.7) (2026-05-17)

### Features

- add tests for feature state management ([cba0a44](https://github.com/Berberer/media-collection-tracker/commit/cba0a44))
- add footer with version and GitHub link ([3f5a57a](https://github.com/Berberer/media-collection-tracker/commit/3f5a57a))
- setup action for publishing images for new tags ([3f74d39](https://github.com/Berberer/media-collection-tracker/commit/3f74d39))

### Bug Fixes

- state updates after series/volume creation ([294aff7](https://github.com/Berberer/media-collection-tracker/commit/294aff7))
- add missing volume edit form on collected volumes page, improve date validation and update logic ([633461a](https://github.com/Berberer/media-collection-tracker/commit/633461a))
- misc layout issues ([349d044](https://github.com/Berberer/media-collection-tracker/commit/349d044))
- ci pipeline ([9ce257f](https://github.com/Berberer/media-collection-tracker/commit/9ce257f))
- version bump for ci testing ([b80d531](https://github.com/Berberer/media-collection-tracker/commit/b80d531))
- add package write permission to action ([ac877fc](https://github.com/Berberer/media-collection-tracker/commit/ac877fc))
- include pocketbase-types to enable image build in actions ([02fa8db](https://github.com/Berberer/media-collection-tracker/commit/02fa8db))

### Chore

- update dependencies ([e0870bb](https://github.com/Berberer/media-collection-tracker/commit/e0870bb))
- update dependencies ([5664288](https://github.com/Berberer/media-collection-tracker/commit/5664288))
- formatting ([fa5a6f9](https://github.com/Berberer/media-collection-tracker/commit/fa5a6f9))
- update ci action versions ([7d9ee0f](https://github.com/Berberer/media-collection-tracker/commit/7d9ee0f))
- update dependencies ([0c7d5ed](https://github.com/Berberer/media-collection-tracker/commit/0c7d5ed))
