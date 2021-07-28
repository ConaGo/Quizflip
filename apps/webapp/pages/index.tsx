import Head from 'next/head';
import Image from 'next/image';
import styles from '../src/styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { ThemeProvider, Checkbox } from '@material-ui/core';
import { darkTheme, lightTheme } from '../src/styles/muiTheme';
import NavBar from '../src/components/NavBar';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <main>
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>

            <Switch>
              <Route path="/about">
                <h2>About</h2>
              </Route>
              <Route path="/">
                <h2>Home</h2>
              </Route>
            </Switch>
          </div>
        </Router>
      </main>
    </div>
  );
}
