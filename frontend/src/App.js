

import './App.css';
import { Route } from 'react-router-dom';
import { ChatPage, HomePage } from './pages';

function App() {
  return (
    <div className="App">
    <Route exact path='/' component={HomePage} />
    <Route exact path='/chats' component={ChatPage} />
    </div>
  );
}

export default App;
