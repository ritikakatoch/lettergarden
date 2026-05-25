// import { Letter, FLOWERS } from '../types';

// export const mockLetters: Letter[] = [
//   {
//     id: '1',
//     to: 'My Love',
//     from: 'Your Beloved',
//     content: "I love you, babe. No matter what your decisions in life, you have my support and I'm proud of you. I wish to see you soon. Take care always.",
//     flowers: [FLOWERS[0], FLOWERS[2], FLOWERS[4]],
//     handwriting: 'dancing',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
//   },
//   {
//     id: '2',
//     to: 'Sayuri',
//     from: 'North',
//     content: "Sayuri, you make my days brighter and my heart calmer. I'm really grateful to have you in my life ❤",
//     flowers: [FLOWERS[1], FLOWERS[3], FLOWERS[6]],
//     handwriting: 'caveat',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
//   },
//   {
//     id: '3',
//     to: 'a stranger',
//     content: 'dear stranger, i hope to be friends with u one day. you are a light in this world and you shine brighter than any of the stars ever could.',
//     flowers: [FLOWERS[5], FLOWERS[4], FLOWERS[2]],
//     handwriting: 'reenieBeanie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
//   },
//   {
//     id: '4',
//     to: 'Addaan',
//     from: 'Love',
//     content: 'Sos maravillosa. Tu presencia es reconfortante, tu voz es calma y ternura y tus palabras siempre son especiales, te adoro asi tal cual eres.',
//     flowers: [FLOWERS[3], FLOWERS[4], FLOWERS[2]],
//     handwriting: 'dancing',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
//   },
//   {
//     id: '5',
//     to: 'whoever needs this',
//     content: "Sometimes I worry I'm not doing enough. Then I look at the flowers and remember they just grow. You are allowed to just grow too.",
//     flowers: [FLOWERS[3], FLOWERS[6]],
//     handwriting: 'dancing',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
//   },
//   {
//     id: '6',
//     to: 'my future self',
//     from: 'past me',
//     content: "You made it. Whatever you were afraid of — you made it through. I'm so proud of you for staying.",
//     flowers: [FLOWERS[0], FLOWERS[3], FLOWERS[5]],
//     handwriting: 'caveat',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
//   },
//   {
//     id: '7',mockLetters
//     to: 'Mom',
//     from: 'Your little one',
//     content: "Thank you for always believing in me even when I didn't believe in myself. You are the reason I try every day.",
//     flowers: [FLOWERS[1], FLOWERS[5]],
//     handwriting: 'greatvibes',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
//   },
//   {
//     id: '8',
//     to: 'Best Friend',
//     from: 'Always yours',
//     content: "Ten years and a thousand inside jokes later, and I still can't imagine doing life without you. Here's to a hundred more.",
//     flowers: [FLOWERS[2], FLOWERS[4], FLOWERS[6]],
//     handwriting: 'indie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
//   },
//   {
//     id: '9',
//     to: 'The night sky',
//     content: "I've been talking to you for years. You never answer, but somehow you always listen. Thank you for being constant when nothing else was.",
//     flowers: [FLOWERS[0], FLOWERS[1]],
//     handwriting: 'shadows',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(),
//   },
//   {
//     id: '10',
//     to: 'Grandma',
//     from: 'Your granddaughter',
//     content: 'I still make your recipe every Sunday. The kitchen smells like you. I hope wherever you are, there are flowers everywhere.',
//     flowers: [FLOWERS[4], FLOWERS[5], FLOWERS[6]],
//     handwriting: 'homemade',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(),
//   },
//   {
//     id: '11',
//     to: 'anyone who reads this',
//     content: "You are not behind. You are not too late. You are right on time for your own story. Please don't forget that.",
//     flowers: [FLOWERS[2], FLOWERS[3]],
//     handwriting: 'caveat',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
//   },
//   {
//     id: '12',
//     to: 'my younger self',
//     from: 'the future you',
//     content: 'Stop shrinking yourself to fit into spaces that were never meant for you. You deserve rooms, not corners.',
//     flowers: [FLOWERS[1], FLOWERS[2], FLOWERS[5]],
//     handwriting: 'dancing',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 264).toISOString(),
//   },
//   {
//     id: '13',
//     to: 'Lena',
//     from: 'M.',
//     content: "Every time I hear that song I think of the drive home, the windows down, and how we didn't need to say anything at all.",
//     flowers: [FLOWERS[0], FLOWERS[6]],
//     handwriting: 'reenieBeanie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 288).toISOString(),
//   },
//   {
//     id: '14',
//     to: 'the ocean',
//     content: "You taught me that the tide always comes back. That what pulls away, returns. I'm learning to believe that about people too.",
//     flowers: [FLOWERS[3], FLOWERS[5], FLOWERS[6]],
//     handwriting: 'greatvibes',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 312).toISOString(),
//   },
//   {
//     id: '15',
//     to: 'Mia',
//     from: 'A grateful heart',
//     content: "The way you show up — quietly, without fanfare — is one of the most beautiful things I've ever witnessed.",
//     flowers: [FLOWERS[1], FLOWERS[4]],
//     handwriting: 'indie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString(),
//   },
//   {
//     id: '16',
//     to: 'my therapist',
//     from: 'a work in progress',
//     content: 'Thank you for holding the lantern while I learned to walk in the dark. I can see the light now.',
//     flowers: [FLOWERS[0], FLOWERS[3], FLOWERS[4]],
//     handwriting: 'caveat',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 360).toISOString(),
//   },
//   {
//     id: '17',
//     to: 'whoever is tired',
//     content: 'Rest is not giving up. Rest is how the garden survives winter. You are allowed to be dormant for a while.',
//     flowers: [FLOWERS[2], FLOWERS[5]],
//     handwriting: 'shadows',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 384).toISOString(),
//   },
//   {
//     id: '18',
//     to: 'Dad',
//     from: 'Always your kid',
//     content: "I finally understand why you were so quiet sometimes. You were thinking about us. That kind of love speaks louder than any words.",
//     flowers: [FLOWERS[1], FLOWERS[3], FLOWERS[6]],
//     handwriting: 'homemade',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 408).toISOString(),
//   },
//   {
//     id: '19',
//     to: 'the version of me that almost quit',
//     content: "I'm so glad you didn't. Look at everything we've built since that moment on the bathroom floor. We're still here.",
//     flowers: [FLOWERS[0], FLOWERS[4], FLOWERS[5]],
//     handwriting: 'dancing',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 432).toISOString(),
//   },
//   {
//     id: '20',
//     to: 'new beginnings',
//     from: 'a seed in spring',
//     content: 'I am terrified and hopeful and small. But I am here. That has to count for something.',
//     flowers: [FLOWERS[2], FLOWERS[6]],
//     handwriting: 'reenieBeanie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 456).toISOString(),
//   },
//   {
//     id: '21',
//     to: 'someone who forgot their worth',
//     content: "You are the kind of person people remember years after meeting you. You leave something golden in everyone you touch.",
//     flowers: [FLOWERS[1], FLOWERS[2], FLOWERS[4]],
//     handwriting: 'greatvibes',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 480).toISOString(),
//   },
//   {
//     id: '22',
//     to: 'Zoë',
//     from: 'From across the world',
//     content: 'Distance is a strange kind of proof. That what matters enough, we carry with us regardless of miles.',
//     flowers: [FLOWERS[0], FLOWERS[5], FLOWERS[6]],
//     handwriting: 'indie',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 504).toISOString(),
//   },
//   {
//     id: '23',
//     to: 'the rain',
//     content: "Everyone else runs from you. I always stay. There's something honest about the way you fall — no hesitation, just complete surrender.",
//     flowers: [FLOWERS[3], FLOWERS[4]],
//     handwriting: 'shadows',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 528).toISOString(),
//   },
//   {
//     id: '24',
//     to: 'my old apartment',
//     from: 'the girl who lived there',
//     content: "I left a piece of myself in your walls. The version of me that learned to be alone and found out that wasn't so terrible after all.",
//     flowers: [FLOWERS[1], FLOWERS[3], FLOWERS[5]],
//     handwriting: 'caveat',
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 552).toISOString(),
//   },
// ];

// // Sort is done here on the server — newest first
// export async function getLetters(): Promise<Letter[]> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(
//         [...mockLetters].sort(
//           (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//       );
//     }, 300);
//   });
// }

// export async function addLetter(letter: Omit<Letter, 'id' | 'createdAt'>): Promise<Letter> {
//   return new Promise((resolve) => {
//     const newLetter: Letter = {
//       ...letter,
//       id: Math.random().toString(36).substring(7),
//       createdAt: new Date().toISOString(),
//     };
//     mockLetters.unshift(newLetter); // prepend so it's first before sort too
//     resolve(newLetter);
//   });
// }

