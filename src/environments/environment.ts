import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { Environment } from './environment.interface';
import { version } from '../../package.json';

export const environment: Environment = {
  production: false,
  appTitle: 'Media Collection Tracker',
  version,
  imports: [NgxsReduxDevtoolsPluginModule.forRoot()],
  ngxsConfig: {
    developmentMode: true,
    selectorOptions: { suppressErrors: false },
  },
};
