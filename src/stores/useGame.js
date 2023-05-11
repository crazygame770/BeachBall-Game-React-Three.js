// Copyright (c) 2023 Michael Kolesidis (michael.kolesidis@gmail.com)
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "./utils";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Is the player in the game or in the main menu?
       */
      isInGame: false,
      proceedToGame: () => {
        set(() => {
          return {
            isInGame: true,
          };
        });
      },

      /**
       * Mode
       */
      mode: getLocalStorage("mode") || "random", // "random", "adventure"
      setMode: (gameMode) => {
        set(() => {
          return {
            mode: gameMode,
          };
        });
      },

      /**
       * Random level generation
       */
      blocksCount: 10,
      blocksSeed: 0,

      /**
       * Level (adventure)
       */
      level: getLocalStorage("level") || 1,
      nextLevel: () => set((state) => ({ level: Number(state.level) + 1 })),
      resetLevel: () => {
        set(() => {
          return {
            level: 1,
          };
        });
      },
      setLevel: (num) => {
        set(() => {
          return {
            level: num,
          };
        });
      },

      /**
       * High scores
       */
      highScoreRandom: getLocalStorage("highScoreRandom") || 0,
      highScoreLevel1: getLocalStorage("highScoreLevel1") || 0,
      highScoreLevel2: getLocalStorage("highScoreLevel2") || 0,
      highScoreLevel3: getLocalStorage("highScoreLevel3") || 0,
      highScoreLevel4: getLocalStorage("highScoreLevel4") || 0,
      highScoreLevel5: getLocalStorage("highScoreLevel5") || 0,
      highScoreLevel6: getLocalStorage("highScoreLevel6") || 0,
      highScoreLevel7: getLocalStorage("highScoreLevel7") || 0,
      highScoreLevel8: getLocalStorage("highScoreLevel8") || 0,
      highScoreLevel9: getLocalStorage("highScoreLevel9") || 0,
      highScoreLevel10: getLocalStorage("highScoreLevel10") || 0,

      /**
       * Time
       */
      startTime: 0,
      endTime: 0,

      /**
       * Phases
       */
      phase: "ready",

      start: () => {
        set((state) => {
          if (state.phase === "ready") {
            return { phase: "playing", startTime: Date.now() };
          }
          return {};
        });
      },

      restart: () => {
        set((state) => {
          if (state.phase === "playing" || state.phase === "ended") {
            return { phase: "ready", blocksSeed: Math.random() };
          }
          return {};
        });
      },

      end: () => {
        set((state) => {
          if (state.phase === "playing") {
            const endTime = Date.now();
            const score = endTime - state.startTime;

            if (state.mode === "random") {
              const highScoreRandom =
                state.highScoreRandom === 0 || score < state.highScoreRandom
                  ? score
                  : state.highScoreRandom;

              setLocalStorage("highScoreRandom", highScoreRandom);
              return { phase: "ended", endTime, highScoreRandom };
            } else if (state.mode === "adventure") {
              // TODO: Implement levels high score
            }
          }
          return {};
        });
      },
    };
  })
);
