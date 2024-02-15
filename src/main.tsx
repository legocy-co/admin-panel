import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppRouter from './routes';
import './app/index.pcss';
import './assets/styles/style.scss';
import './assets/styles/colors.scss';
import './assets/styles/global.scss';
import './assets/styles/reset.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/*TODO: Routes*/}
    <DndProvider backend={HTML5Backend}>
      <AppRouter />
    </DndProvider>
  </BrowserRouter>
);
