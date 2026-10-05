/** TEST ONLY. Never included in the extension's entrypoints or production build. */
import ReactDOM from 'react-dom/client';
import { App } from '../../../src/presentation/shell/App';
import { fixturePlatform } from '../../fixtures/application/platform';
import '../../../src/presentation/shell/styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<App platform={fixturePlatform} />);
