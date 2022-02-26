import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Button from '../components/Button';
import Preview from '../components/Preview';

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
  preview: boolean;
}

interface HomeProps {
  postsPagination: PostPagination;
  preview?: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;

  const [loadResults, setLoadResults] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  const formateDate = (first_publication_date): string => {
    return format(new Date(first_publication_date), 'PP', {
      locale: ptBR,
    });
  };

  const getMorePosts = async (): Promise<void> => {
    const morePosts = await fetch(nextPage);
    const posts = await morePosts.json();

    const allPosts = [...loadResults, ...posts.results];

    setLoadResults(allPosts);
    setNextPage(posts.next_page);
  };

  return (
    <main className={commonStyles.wrapper}>
      <ul className={styles.postContent}>
        {loadResults.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <li>
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

      {nextPage && <Button onClick={getMorePosts}>Carregar mais posts</Button>}

      {preview && <Preview />}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsPagination = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      ref: previewData?.ref ?? null,
      orderings: '[document.first_publication_date desc]',
    }
  );

  return {
    props: {
      postsPagination,
      preview,
    },
  };
};
