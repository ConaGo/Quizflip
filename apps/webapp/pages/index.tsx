import Head from 'next/head';
import Image from 'next/image';
import styles from 'src/styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { ThemeProvider, Checkbox } from '@material-ui/core';
import { darkTheme, lightTheme } from '@/styles/muiTheme';
import NavBar from '@/components/NavBar';
export default function Home() {
  return (
    <div>
      <Head>
        <title>Learnit Digital</title>
        <meta name="description" content="Online Learning for University" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main>
        <ThemeProvider theme={lightTheme}>
          <NavBar></NavBar>
        </ThemeProvider>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
