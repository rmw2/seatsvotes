import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SeatsVotes from './SeatsVotes';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SeatsVotes />, document.getElementById('root'));
registerServiceWorker();
