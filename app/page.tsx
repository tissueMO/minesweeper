'use client';

import { IconButton } from '@/components/buttons';
import { Game } from '@/components/game';
import { Logo } from '@/components/logo';
import { css, cx } from '@/styled-system/css';
import { center, flex } from '@/styled-system/patterns';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';

/**
 * トップページ
 */
export default function Home() {
  const [games, setGames] = useState<number[]>([]);

  // (初回のみ)ゲーム開始
  useEffect(() => {
    newGame();
  }, []);

  // 新規ゲーム開始
  const newGame = () => {
    setGames([new Date().getTime(), ...games]);
  };

  return (
    <main className={styles.main}>
      <Logo title="マインスイーパー" />

      <Flipper flipKey={games.join()}>
        <div className={styles.newGameButtonWrapper}>
          <IconButton icon={faPlus} size="3x" onClick={newGame} />
        </div>

        <div className={styles.gamesWrapper}>
          {games.map((g) => (
            <Flipped key={g} flipId={g}>
              <div>
                <Game />
              </div>
            </Flipped>
          ))}
        </div>
      </Flipper>
    </main>
  );
}

const styles = {
  main: flex({
    direction: 'column',
  }),

  newGameButtonWrapper: cx(
    center(),
    css({
      margin: '1rem',
    }),
  ),

  gamesWrapper: flex({
    wrap: 'wrap',
    justifyContent: 'center',
  }),
};
