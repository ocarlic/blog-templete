import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContant}>
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width={238} height={26} />
        </Link>
      </div>
    </header>
  );
}
