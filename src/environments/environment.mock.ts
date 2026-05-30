import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { version } from '../../package.json';
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  appTitle: 'Media Collection Tracker Mock',
  version,
  imports: [NgxsReduxDevtoolsPluginModule.forRoot()],
  ngxsConfig: {
    developmentMode: true,
    selectorOptions: { suppressErrors: false },
  },
};
