import Link from 'next/link';
import styles from './prevnextpost.module.scss';

interface IPrevNextPostProps {
  link: string;
  title: string;
  next: boolean;
}

const PrevNextPost = ({
  link,
  title,
  next,
}: IPrevNextPostProps): JSX.Element => (
  <Link href={`/post/${link}`}>
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      <button className={next && styles.nextPost} type="button">
        {next ? 'Próximo post' : 'Post anterior'}
      </button>
    </div>
  </Link>
);

export default PrevNextPost;
