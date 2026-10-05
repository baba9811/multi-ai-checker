import ReactDOM from 'react-dom/client';
import { App } from '../../src/presentation/shell/App';
import { chromePlatform } from '../../src/infrastructure/chrome/platform';
import '../../src/presentation/shell/styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<App platform={chromePlatform} />);
