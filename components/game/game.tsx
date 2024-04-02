'use client';

import { css, cx } from '@/styled-system/css';
import { border3d, center, flex } from '@/styled-system/patterns';
import { Level, State } from '@/types';
import { useRef, useState } from 'react';
import { NikoChanButton } from '../buttons';
import { Digits } from '../digits/digits';
import { Tiles } from './tiles';

// 難易度マスター
const LEVELS: Level[] = [
  {
    caption: '簡単',
    width: 9,
    height: 9,
    mines: 10,
  },
  {
    caption: '普通',
    width: 16,
    height: 16,
    mines: 40,
  },
  {
    caption: '難しい',
    width: 30,
    height: 16,
    mines: 99,
  },
];

/**
 * マインスイーパー
 */
export function Game() {
  const [id, setId] = useState(new Date().getTime());
  const [level, setLevel] = useState({ ...LEVELS[0] });
  const [state, setState] = useState(State.Initialized);
  const [seconds, setSeconds] = useState(0);
  const [retry, setRetry] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const isStarted = state !== State.Initialized;
  const isEnded = [State.Completed, State.Dead].includes(state);

  const emotion = {
    [State.Playing]: 'smile',
    [State.Initialized]: 'smile',
    [State.Completed]: 'laugh-beam',
    [State.Dead]: 'dizzy',
  }[state];

  const stop = () => {
    clearInterval(timer?.current ?? undefined);
    timer.current = null;
  };
  const reset = () => {
    stop();
    setState(State.Initialized);
    setSeconds(0);
    setRetry(0);
    setId(new Date().getTime());
  };

  const onStart = () => {
    stop();
    setState(State.Playing);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const onEnd = (abort: boolean) => {
    stop();
    setState(abort ? State.Dead : State.Completed);
  };
  const onLevelChange = (index: number) => {
    reset();
    setLevel({ ...LEVELS[index] });
  };
  const onShuffle = () => {
    if (state === State.Playing) {
      setRetry((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controllers}>
        <label className={styles.label}>難易度:</label>
        {!isStarted ? (
          // ゲーム開始前までは難易度変更OK
          <select className={styles.comboBox} onChange={(e) => onLevelChange(Number.parseInt(e.target.value))}>
            {Object.entries(LEVELS).map(([index, { caption }]) => (
              <option key={index} value={index}>
                {caption}
              </option>
            ))}
          </select>
        ) : (
          // ゲーム開始後は難易度変更NG
          <span>{level.caption}</span>
        )}
      </div>

      <div className={center()}>
        <div className={styles.panelWrapper}>
          <div className={styles.panelHeader}>
            <Digits value={level.mines} />
            <NikoChanButton emotion={emotion} size="3x" onClick={onShuffle} className={isEnded ? 'disabled' : ''} />
            <Digits value={seconds} />
          </div>
          <Tiles
            key={id}
            width={level.width}
            height={level.height}
            mines={level.mines}
            retry={retry}
            onStart={onStart}
            onEnd={onEnd}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: css({
    margin: '2rem',
  }),

  label: css({
    marginRight: '0.5rex',
  }),

  comboBox: css({
    width: '5rem',
    fontSize: '85%',
    borderWidth: '1px',
    borderColor: 'rgb(118, 118, 118)',
  }),

  controllers: cx(
    center(),
    css({
      marginBottom: '1rem',
    }),
    flex({
      align: 'center',
    }),
  ),

  panelWrapper: cx(
    flex({
      direction: 'column',
      justifyContent: 'center',
    }),
    css({
      padding: '12px',
    }),
    border3d({
      borderWidth: '8px',
      leftTopColor: '#eeeeee',
      rightBottomColor: '#808080',
      backgroundColor: 'lightgray',
    }),
  ),

  panelHeader: cx(
    flex({
      wrap: 'nowrap',
      alignItems: 'center',
    }),
    css({
      margin: '0 auto',
      marginBottom: '0.5rem',
      padding: '0.5rem 0.8rem',
    }),
    border3d({
      borderWidth: '4px',
      leftTopColor: '#808080',
      rightBottomColor: '#dfdfdf',
      backgroundColor: 'lightgray',
    }),
  ),
};
