'use client';

import { cx } from '@/styled-system/css';
import { border3d, flex } from '@/styled-system/patterns';
import { Digit } from './digit';

type Props = {
  value: number;
  length?: number;
};

/**
 * 7セグメントデジタル数字 (複数桁)
 */
export function Digits({ value = 0, length = 3 }: Readonly<Props>) {
  // 桁数を最大幅に揃えて分離する
  const limitedValue = Math.max(0, Math.min(value, 10 ** length - 1));
  const paddingValue = limitedValue.toString().padStart(length, '0');
  const digits = [...paddingValue].map((v) => Number.parseInt(v));

  return (
    <div className={styles.digits}>
      {digits.map((d, i) => (
        <Digit key={i} value={d} />
      ))}
    </div>
  );
}

const styles = {
  digits: cx(
    flex({ alignSelf: 'flex-end' }),
    border3d({
      borderWidth: '2px',
      leftTopColor: '#808080',
      rightBottomColor: '#dfdfdf',
      backgroundColor: 'lightgray',
    }),
  ),
};
