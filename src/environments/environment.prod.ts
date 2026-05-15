import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { Environment } from './environment.interface';
import { version } from '../../package.json';

export const environment: Environment = {
  production: true,
  appTitle: 'Media Collection Tracker Prod',
  version,
  backendUrl: location.host,
  imports: [NgxsReduxDevtoolsPluginModule.forRoot()],
  ngxsConfig: {
    developmentMode: false,
    selectorOptions: { suppressErrors: false },
  },
};
