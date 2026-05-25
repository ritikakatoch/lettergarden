export type HandwritingStyle =
  | 'dancing'
  | 'caveat'
  | 'pacifico'
  | 'homemade'
  | 'indie'
  | 'shadows'
  | 'poppins'
  | 'greatvibes'
  | 'reenieBeanie'
  | 'cedarville'
  ;

export const FLOWERS = [
  '/stickers/053da0042a87d1643e1b1f3ba7d7337ec10eebed.png',
  '/stickers/233e2136f1cb0d91b0ace9deafea0ed0417cf7e0.png',
  '/stickers/416fe7be743f576502d0854395e5c8df8cc75a0d.png',
  '/stickers/63413a51be7f8ecc80ada383aa6b74b7f0d7fb31.png',
  '/stickers/6d8f86ecc6e1fe9b76647207546481c4fb38e0fc.png',
  '/stickers/82e4a498284b6f5fabd4534c902441362e1cdc50.png',
  '/stickers/f8a19048602434e4a81f8b3f2efd284349130d3c.png',
  // '/stickers/f1.png',
  // '/stickers/f2.png',
  // '/stickers/f3.png',
];

export const ASSETS = {
  flower: '/stickers/63413a51be7f8ecc80ada383aa6b74b7f0d7fb31.png',
  envelope: '/stickers/00572ac6408106720bf2d0f99d3831521b3f0a56.png',
  flap: '/stickers/87d0888757ed59cfdf2ef9eb16536a2a2b67f054.png',
  paper: '/stickers/b5969a304782471a2519a2466d03b649f087246b.png',
  logoIcon: '/stickers/87d0888757ed59cfdf2ef9eb16536a2a2b67f054.png',
};

export const STICKERS = FLOWERS;

export interface Letter {
  id: string;
  to: string;
  shareCode: string;
  from?: string;
  content: string;
  flowers: string[];
  handwriting: HandwritingStyle;
  createdAt: string;
}
