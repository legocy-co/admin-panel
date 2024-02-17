export interface SpritesMap {
  sprite: 'arrow-down' | 'logo';
}
export const SPRITES_META = {
  sprite: {
    filePath: 'sprite.35c87ad1.svg',
    items: {
      'arrow-down': {
        viewBox: '0 0 8 10',
        width: 8,
        height: 10,
      },
      logo: {
        viewBox: '0 0 132 22',
        width: 132,
        height: 22,
      },
    },
  },
} satisfies Record<
  string,
  {
    filePath: string;
    items: Record<
      string,
      {
        viewBox: string;
        width: number;
        height: number;
      }
    >;
  }
>;
