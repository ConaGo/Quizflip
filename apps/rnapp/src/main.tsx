import 'react-native-gesture-handler';

//adding hidden dependencies so nx adds them
import 'react-native-reanimated';
import 'react-native-screens';
import 'react-native-safe-area-context';
import '@react-native-community/masked-view';

// fast encoding polyfill
// see https://github.com/sideway/joi/issues/2141
import 'fast-text-encoding';
import { AppRegistry } from 'react-native';
import App from './app/App';

AppRegistry.registerComponent('main', () => App);
