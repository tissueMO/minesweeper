'use client';

import config from '@/next.config.mjs';
import { css, cx } from '@/styled-system/css';
import { center, flex } from '@/styled-system/patterns';
import Image from 'next/image';

const BASE_PATH = config.basePath ?? '';

type Props = {
  title: string;
};

/**
 * ロゴ
 */
export function Logo({ title }: Readonly<Props>) {
  const image = (
    <Image
      src={`${BASE_PATH}/logo.svg`}
      alt="Logo"
      width={180}
      height={37}
      priority
      className={styles.image}
    />
  );

  return (
    <div className={styles.wrapper}>
      {image}
      <span className={styles.title}>{title}</span>
      {image}
    </div>
  );
}

const styles = {
  wrapper: cx(
    center(),
    flex({
      align: 'center',
    }),
    css({
      fontSize: '3rem',
      marginBottom: '3rem',
      color: '#444',
    }),
  ),

  title: css({
    margin: '0 0.1rem',
    fontWeight: '900',
  }),

  image: css({
    width: '5rem',
    height: '5rem',
    margin: '0',
  }),
};
