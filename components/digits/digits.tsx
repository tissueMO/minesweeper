'use client';

import { border3d, flex } from '@/styled-system/patterns';
import { Digit } from './digit';
import { cx } from '@/styled-system/css';

type Props = {
  /**
   * 値
   */
  value: number;

  /**
   * 表示可能な桁数 (これを超えた値はカンスト表示になる)
   */
  size?: number;
};

/**
 * 7セグメントデジタル数字
 */
export const Digits = ({ value = 0, size = 3 }: Props) => {
  const limitedValue = ([...Array(size)].fill('0').join('') + Math.min(value, 10 ** size - 1)).slice(-size);
  const digits = [...`${limitedValue}`].slice(0, size).map((v) => Number.parseInt(v));

  return (
    <div
      className={cx(
        flex({ alignSelf: 'flex-end' }),
        border3d({
          borderWidth: '2px',
          leftTopColor: '#808080',
          rightBottomColor: '#dfdfdf',
          backgroundColor: 'lightgray',
        }),
      )}
    >
      {digits.map((d) => {
        return <Digit value={d} />;
      })}
    </div>
  );
};