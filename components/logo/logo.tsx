'use client';

import config from '@/next.config.mjs';
import { css } from '@/styled-system/css';
import Image from 'next/image';

const BASE_PATH = config.basePath ?? '';

/**
 * ロゴ
 */
export function Logo() {
  return (
    <Image
      src={`${BASE_PATH}/logo.svg`}
      alt="Minesweeper Logo"
      width={180}
      height={37}
      priority
      className={css({
        width: '5rem',
        height: '5rem',
        margin: '0',
      })}
    />
  );
}
