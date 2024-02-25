'use client';

import { NikoChanButton } from '@/components/buttons';
import { Digits } from '@/components/digits';
import { Logo } from '@/components/logo';
import { Panel } from '@/components/panel';
import { css, cx } from '@/styled-system/css';
import { border3d, center, flex } from '@/styled-system/patterns';
import { useRef, useState } from 'react';

type Level = {
  caption: string;
  width: number;
  height: number;
  mines: number;
};

enum State {
  Initialized = 'initialized',
  Playing = 'playing',
  Cleared = 'cleared',
  Dead = 'dead',
}

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

export default function Home() {
  const [gameId, setGameId] = useState(new Date().getTime());
  const [selectedLevel, setSelectedLevel] = useState({ ...LEVELS[0] });
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState(State.Initialized);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  /**
   * (イベント) ゲーム開始
   */
  const onStart = () => {
    setState(State.Playing);

    stopTimer();
    setSeconds(0);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  /**
   * (イベント) ゲーム終了
   */
  const onEnd = (cleared: boolean) => {
    setState(cleared ? State.Cleared : State.Dead);

    stopTimer();
  };

  /**
   * (イベント) ゲームリセット
   */
  const onReset = () => {
    resetGame();
  };

  /**
   * (イベント) ゲーム難易度変更
   */
  const onLevelSelect = (index: number) => {
    setSelectedLevel({ ...LEVELS[index] });

    resetGame();
  };

  /**
   * タイマーを停止します。
   */
  const stopTimer = () => {
    clearInterval(timer?.current ?? undefined);
    timer.current = null;
  };

  /**
   * ゲームをリセットします。
   */
  const resetGame = () => {
    // タイマー停止
    stopTimer();
    setSeconds(0);

    // 盤面リセット
    setGameId(new Date().getTime());
  };

  /**
   * ゲーム状態に応じたニコちゃんボタンの表情を返します。
   * @param state
   */
  const emotion = (state: State) => {
    switch (state) {
      case State.Cleared:
        return 'laugh-beam';
      case State.Dead:
        return 'dizzy';
      default:
        return 'smile';
    }
  };

  return (
    <main className={mainStyle}>
      <div className={headerStyle}>
        <Logo />
        <span className={titleStyle}>マインスイーパー</span>
        <Logo />
      </div>

      <div className={controllersStyle}>
        <label className={labelStyle}>難易度:</label>
        <select className={comboBoxStyle} onChange={(e) => onLevelSelect(Number.parseInt(e.target.value))}>
          {Object.entries(LEVELS).map(([index, { caption }]) => (
            <option value={index}>{caption}</option>
          ))}
        </select>
      </div>

      <div className={center()}>
        <div className={panelWrapperStyle}>
          <div className={panelHeaderStyle}>
            <Digits value={selectedLevel.mines} />
            <NikoChanButton emotion={emotion(state)} size="3x" onClick={onReset} />
            <Digits value={seconds} />
          </div>
          <Panel
            key={gameId}
            width={selectedLevel.width}
            height={selectedLevel.height}
            mines={selectedLevel.mines}
            onStart={onStart}
            onEnd={onEnd}
          />
        </div>
      </div>
    </main>
  );
}

const mainStyle = flex({ direction: 'column' });

const titleStyle = css({ margin: '0 0.1rem', fontWeight: '900' });

const headerStyle = cx(
  center(),
  flex({ align: 'center' }),
  css({ fontSize: '3rem', marginBottom: '3rem', color: '#444' }),
);

const labelStyle = css({ marginRight: '0.5rem' });

const comboBoxStyle = css({
  width: '5rem',
  fontSize: '85%',
  borderWidth: '1px',
  borderColor: 'rgb(118, 118, 118)',
});

const controllersStyle = cx(center(), css({ marginBottom: '2rem' }), flex({ align: 'center' }));

const panelWrapperStyle = cx(
  flex({ direction: 'column', justifyContent: 'center' }),
  css({ padding: '12px' }),
  border3d({
    borderWidth: '8px',
    leftTopColor: '#eeeeee',
    rightBottomColor: '#808080',
    backgroundColor: 'lightgray',
  }),
);

const panelHeaderStyle = cx(
  flex({ wrap: 'nowrap' }),
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
);
