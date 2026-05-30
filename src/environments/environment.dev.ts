import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { version } from '../../package.json';
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  appTitle: 'Media Collection Tracker Dev',
  version,
  backendUrl: 'http://localhost:8090',
  imports: [NgxsReduxDevtoolsPluginModule.forRoot()],
  ngxsConfig: {
    developmentMode: true,
    selectorOptions: { suppressErrors: false },
  },
};
