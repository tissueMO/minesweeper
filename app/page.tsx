'use client';

import Image from 'next/image';
import { Digits } from '@/components/digits/digits';
import { Panel } from '@/components/panel/panel';
import { useState } from 'react';
import { css, cx } from '@/styled-system/css';
import { border3d, button, center, flex } from '@/styled-system/patterns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';

type Level = {
  difficulity: number;
  sizeWidth: number;
  sizeHeight: number;
  mineCount: number;
};

const LEVELS: Record<string, Level> = {
  簡単: {
    difficulity: 0,
    sizeWidth: 9,
    sizeHeight: 9,
    mineCount: 10,
  },
  普通: {
    difficulity: 1,
    sizeWidth: 16,
    sizeHeight: 16,
    mineCount: 40,
  },
  難しい: {
    difficulity: 2,
    sizeWidth: 30,
    sizeHeight: 16,
    mineCount: 99,
  },
};

export default function Home() {
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [selectedLevelDetail, setSelectedLevelDetail] = useState(LEVELS['簡単']);
  // const timer = useRef<ReturnType<typeof setTimeout> | null>();

  return (
    <main className={flex({ direction: 'column' })}>
      <div
        className={cx(
          css({ fontSize: '3rem', marginBottom: '3rem', color: '#444' }),
          flex({ align: 'center' }),
          center(),
        )}
      >
        <Image src="/logo.svg" alt="Minesweeper Logo" width={180} height={37} priority className={logoStyle} />
        <span className={css({ margin: '0 0.1rem', fontWeight: '900' })}>マインスイーパー</span>
        <Image src="/logo.svg" alt="Minesweeper Logo" width={180} height={37} priority className={logoStyle} />
      </div>

      <div className={cx(css({ marginBottom: '2rem' }), flex({ align: 'center' }), center())}>
        <label htmlFor="level">難易度: </label>
        <select id="level">
          {Object.entries(LEVELS).map(([name, level]) => (
            <option>{name}</option>
          ))}
        </select>
      </div>

      <div className={center()}>
        <div
          className={cx(
            css({ padding: '12px' }),
            border3d({
              borderWidth: '8px',
              leftTopColor: '#eeeeee',
              rightBottomColor: '#808080',
              backgroundColor: 'lightgray',
            }),
          )}
        >
          <div
            className={cx(
              css({
                margin: '0 auto',
                marginBottom: '0.5rem',
                padding: '0.5rem 0.8rem',
              }),
              flex({ wrap: 'nowrap' }),
              border3d({
                borderWidth: '4px',
                leftTopColor: '#808080',
                rightBottomColor: '#dfdfdf',
                backgroundColor: 'lightgray',
              }),
            )}
          >
            {/* 地雷数 */}
            <Digits value={selectedLevelDetail.mineCount} />

            {/* リセットボタン: ニコちゃんマーク */}
            <div
              className={cx(
                button(),
                css({
                  minWidth: '0',
                  minHeight: '0',
                  padding: '0.5rem',
                  margin: '0 0.5rem',
                }),
              )}
            >
              <div
                className={cx(
                  css({
                    margin: '0 auto',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    position: 'relative',
                    bgColor: '#000',
                  }),
                  flex({ justifyContent: 'center', alignItems: 'center' }),
                )}
              >
                <FontAwesomeIcon
                  icon={faFaceSmile}
                  size="3x"
                  className={css({
                    width: '40px',
                    height: '40px',
                    margin: '0',
                    color: 'yellow',
                  })}
                />
              </div>
            </div>

            {/* 経過時間 */}
            <Digits value={timeSeconds} />
          </div>

          {/* タイル盤面 */}
          <Panel width={7} height={10} />
        </div>
      </div>
    </main>
  );
}

const logoStyle = css({
  width: '5rem',
  height: '5rem',
  margin: '0',
});
