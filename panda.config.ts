import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,

  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          '0%': {
            transform: 'translate(-50%, -50%) scale(0)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.5)',
          },
          '100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
    },
  },

  patterns: {
    extend: {
      border3d: {
        description: '3D境界',
        properties: {
          borderWidth: { type: "string" },
          leftTopColor: { type: "string" },
          rightBottomColor: { type: "string" },
          backgroundColor: { type: "string" },
        },
        transform({borderWidth, leftTopColor, rightBottomColor, backgroundColor}) {
          return {
            borderTop: `${borderWidth} solid ${leftTopColor}`,
            borderLeft: `${borderWidth} solid ${leftTopColor}`,
            borderRight: `${borderWidth} solid ${rightBottomColor}`,
            borderBottom: `${borderWidth} solid ${rightBottomColor}`,
            boxSizing: 'border-box',
            bgColor: backgroundColor,
          };
        },
      },

      button: {
        description: 'ボタン',
        transform() {
          return {
            background: 'silver',
            boxShadow: [
              'inset -1px -1px #0a0a0a',
              'inset 1px 1px #ffffff',
              'inset -2px -2px #808080',
              'inset 2px 2px #dfdfdf',
            ].join(','),

            '&:active:not(.disabled)': {
              boxShadow: [
                'inset -1px -1px #ffffff',
                'inset 1px 1px #0a0a0a',
                'inset -2px -2px #dfdfdf',
                'inset 2px 2px #808080',
              ].join(','),

              '& *': {
                left: '1px',
                top: '1px',
              },
            },
          };
        },
      }
    },
  },

  outdir: "styled-system",
});
