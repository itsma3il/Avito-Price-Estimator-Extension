import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div>
    <h1>Standalone Page</h1>
    <form>
      <label>Name: <input type="text" /></label><br />
      <label>Email: <input type="email" /></label><br />
      <button type="submit">Submit</button>
    </form>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
