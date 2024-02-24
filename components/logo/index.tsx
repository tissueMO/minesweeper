'use client';
import { css } from '@/styled-system/css';
import Image from 'next/image';

/**
 * ロゴ
 */
export const Logo = () => {
  return <Image src="/logo.svg" alt="Minesweeper Logo" width={180} height={37} priority className={logoStyle} />;
};

const logoStyle = css({
  width: '5rem',
  height: '5rem',
  margin: '0',
});
