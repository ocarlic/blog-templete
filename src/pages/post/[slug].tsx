import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import Head from 'next/head';

import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';
import { getPrismicClient } from '../../services/prismic';

import Comments from '../../components/Comments';
import PrevNextPost from '../../components/PrevNextPost';
import Preview from '../../components/Preview';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  id: string;
  uid?: string;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview: boolean;
  prevPost?: Post;
  nextPost?: Post;
}

export default function Post({
  post,
  preview,
  prevPost,
  nextPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const timeToRead = Math.ceil(
    post?.data.content.reduce((prev, curr) => {
      return prev + RichText.asText(curr.body).split(' ').length;
    }, 0) / 200
  );

  const formattedPost = {
    ...post,
    first_publication_date: format(
      new Date(post?.first_publication_date),
      'PP',
      {
        locale: ptBR,
      }
    ),
    last_publication_date: format(
      new Date(post.last_publication_date),
      "PP', às 'k':'m",
      {
        locale: ptBR,
      }
    ),
  };

  return (
    <>
      <Head>
        <title>spacetraveling | {formattedPost.data.title}</title>
      </Head>

      <div className={styles.container}>
        <img
          src={formattedPost.data.banner.url ?? ''}
          alt={formattedPost.data.title}
        />

        <main className={styles.main}>
          <div className={styles.header}>
            <h1>{formattedPost.data.title}</h1>

            <div className={styles.info}>
              <div>
                <FiCalendar />
                <span>{formattedPost.first_publication_date}</span>
              </div>

              <div>
                <FiUser />
                <span>{formattedPost.data.author}</span>
              </div>

              <div>
                <FiClock />
                <span>{timeToRead} min</span>
              </div>
            </div>

            {post.last_publication_date !== post.first_publication_date && (
              <p>* editado em {formattedPost.last_publication_date}</p>
            )}
          </div>

          {formattedPost?.data?.content?.map(item => (
            <article key={item.heading}>
              <h2 dangerouslySetInnerHTML={{ __html: item.heading }} />
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }}
              />
            </article>
          ))}
        </main>

        <hr className={styles.divider} />

        <div className={styles.postsNavigation}>
          {prevPost && (
            <PrevNextPost
              link={prevPost.uid}
              title={prevPost.data.title}
              next={false}
            />
          )}

          {nextPost && (
            <PrevNextPost
              link={nextPost.uid}
              title={nextPost.data.title}
              next
            />
          )}
        </div>

        <div className={commonStyles.wrapper}>
          <Comments />

          {preview && <Preview />}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = (
    await prismic.query(Prismic.Predicates.at('document.type', 'posts'), {
      pageSize: 5,
    })
  ).results;

  return {
    paths: posts.map(post => {
      return { params: { slug: post.uid } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
  params,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const post = (await prismic.getByUID('posts', slug as string, {
    lang: 'pt-br',
    ref: previewData?.ref ?? null,
  })) as Post;

  const prevPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'posts'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date desc]',
    })
  ).results[0];

  const nextPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'posts'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date]',
    })
  ).results[0];

  return {
    props: {
      post,
      preview,
      prevPost: prevPost ?? null,
      nextPost: nextPost ?? null,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
