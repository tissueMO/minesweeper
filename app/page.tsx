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
      <div className={styles.header}>
        <Logo />
        <span className={styles.title}>マインスイーパー</span>
        <Logo />
      </div>

      <Flipper flipKey={games.join()}>
        <div className={styles.addGameButtonWrapper}>
          <IconButton icon={faPlus} size="3x" onClick={newGame} />
        </div>

        <div className={styles.gameWrapper}>
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
  main: flex({ direction: 'column' }),

  title: css({ margin: '0 0.1rem', fontWeight: '900' }),

  header: cx(center(), flex({ align: 'center' }), css({ fontSize: '3rem', marginBottom: '3rem', color: '#444' })),

  gameWrapper: flex({ wrap: 'wrap', justifyContent: 'center' }),

  addGameButtonWrapper: cx(
    center(),
    css({
      margin: '1rem',
    }),
  ),
};
