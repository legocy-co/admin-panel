import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/*TODO: Routes*/}
    <DndProvider backend={HTML5Backend}></DndProvider>
  </BrowserRouter>
);
