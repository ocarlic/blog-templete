import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results } = postsPagination;

  const formateDate = (first_publication_date): string => {
    return format(new Date(first_publication_date), 'PP', {
      locale: ptBR,
    });
  };

  return (
    <main className={commonStyles.wrapper}>
      <ul className={styles.postContent}>
        {results.map(post => (
          <Link href={post.uid}>
            <li key={post.uid}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>

              <span>
                <FiCalendar />
                <time>{formateDate(post.first_publication_date)}</time>

                <FiUser />
                <p>{post.data.author}</p>
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsPagination = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  return {
    props: {
      postsPagination,
    },
  };
};
