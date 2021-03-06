import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <div className={styles.headerContant}>
          <Image src="/images/logo.svg" alt="logo" width={238} height={26} />
        </div>
      </Link>
    </header>
  );
}
