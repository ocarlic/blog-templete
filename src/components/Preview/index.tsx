import Link from 'next/link';
import styles from './preview.module.scss';

const Preview = (): JSX.Element => (
  <Link href="/api/exit-preview">
    <a className={styles.wrapper}>Sair do modo Preview</a>
  </Link>
);

export default Preview;
