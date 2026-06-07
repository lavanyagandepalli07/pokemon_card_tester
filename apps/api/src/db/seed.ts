import { connectDB } from '../lib/db';
import { ReferenceCard } from '../models';

const SEED_CARDS = [
  { name: 'Charizard',   set: 'Base Set',   number: '4/102',  hp: 120, type: 'Fire',      imageKey: 'charizard_base.png',  metadata: { rarity: 'Rare Holo',    artist: 'Mitsuhiro Arita' } },
  { name: 'Blastoise',   set: 'Base Set',   number: '2/102',  hp: 100, type: 'Water',     imageKey: 'blastoise_base.png',  metadata: { rarity: 'Rare Holo',    artist: 'Ken Sugimori' } },
  { name: 'Venusaur',    set: 'Base Set',   number: '15/102', hp: 100, type: 'Grass',     imageKey: 'venusaur_base.png',   metadata: { rarity: 'Rare Holo',    artist: 'Mitsuhiro Arita' } },
  { name: 'Pikachu',     set: 'Base Set',   number: '58/102', hp: 40,  type: 'Lightning', imageKey: 'pikachu_base.png',    metadata: { rarity: 'Common',       artist: 'Mitsuhiro Arita' } },
  { name: 'Mewtwo',      set: 'Base Set',   number: '10/102', hp: 60,  type: 'Psychic',   imageKey: 'mewtwo_base.png',     metadata: { rarity: 'Rare Holo',    artist: 'Ken Sugimori' } },
  { name: 'Raichu',      set: 'Base Set',   number: '14/102', hp: 80,  type: 'Lightning', imageKey: 'raichu_base.png',     metadata: { rarity: 'Rare',         artist: 'Mitsuhiro Arita' } },
  { name: 'Alakazam',    set: 'Base Set',   number: '1/102',  hp: 80,  type: 'Psychic',   imageKey: 'alakazam_base.png',   metadata: { rarity: 'Rare Holo',    artist: 'Ken Sugimori' } },
  { name: 'Machamp',     set: 'Base Set',   number: '8/102',  hp: 120, type: 'Fighting',  imageKey: 'machamp_base.png',    metadata: { rarity: 'Rare Holo',    artist: 'Ken Sugimori' } },
  { name: 'Gengar',      set: 'Fossil',     number: '5/62',   hp: 80,  type: 'Psychic',   imageKey: 'gengar_fossil.png',   metadata: { rarity: 'Rare Holo',    artist: 'Keiji Kinebuchi' } },
  { name: 'Eevee',       set: 'Jungle',     number: '51/64',  hp: 30,  type: 'Colorless', imageKey: 'eevee_jungle.png',    metadata: { rarity: 'Common',       artist: 'Kagemaru Himeno' } },
  { name: 'Flareon',     set: 'Jungle',     number: '19/64',  hp: 70,  type: 'Fire',      imageKey: 'flareon_jungle.png',  metadata: { rarity: 'Rare Holo',    artist: 'Kagemaru Himeno' } },
  { name: 'Vaporeon',    set: 'Jungle',     number: '28/64',  hp: 80,  type: 'Water',     imageKey: 'vaporeon_jungle.png', metadata: { rarity: 'Rare Holo',    artist: 'Kagemaru Himeno' } },
  { name: 'Jolteon',     set: 'Jungle',     number: '20/64',  hp: 70,  type: 'Lightning', imageKey: 'jolteon_jungle.png',  metadata: { rarity: 'Rare Holo',    artist: 'Kagemaru Himeno' } },
  { name: 'Scyther',     set: 'Jungle',     number: '26/64',  hp: 70,  type: 'Grass',     imageKey: 'scyther_jungle.png',  metadata: { rarity: 'Rare Holo',    artist: 'Keiji Kinebuchi' } },
  { name: 'Lugia',       set: 'Neo Genesis', number: '9/111', hp: 90,  type: 'Colorless', imageKey: 'lugia_neo.png',       metadata: { rarity: 'Rare Holo',    artist: 'Hironobu Yoshida' } },
  { name: 'Ho-Oh',       set: 'Neo Revelation', number: '7/64', hp: 110, type: 'Fire',   imageKey: 'hooh_neorev.png',     metadata: { rarity: 'Rare Holo',    artist: 'Hironobu Yoshida' } },
  { name: 'Typhlosion', set: 'Neo Genesis',  number: '17/111', hp: 100, type: 'Fire',    imageKey: 'typhlosion_neo.png',  metadata: { rarity: 'Rare Holo',    artist: 'Atsuko Nishida' } },
  { name: 'Meganium',   set: 'Neo Genesis',  number: '10/111', hp: 100, type: 'Grass',   imageKey: 'meganium_neo.png',    metadata: { rarity: 'Rare Holo',    artist: 'Atsuko Nishida' } },
  { name: 'Feraligatr', set: 'Neo Genesis',  number: '4/111',  hp: 100, type: 'Water',   imageKey: 'feraligatr_neo.png',  metadata: { rarity: 'Rare Holo',    artist: 'Atsuko Nishida' } },
  { name: 'Pikachu',    set: 'Jungle',       number: '60/64',  hp: 40,  type: 'Lightning', imageKey: 'pikachu_jungle.png', metadata: { rarity: 'Common',      artist: 'Mitsuhiro Arita' } },
];

async function main() {
  await connectDB();
  console.log('🌱 Seeding Reference Cards into MongoDB...');

  await ReferenceCard.deleteMany({});
  console.log('🧹 Cleared existing reference cards');

  await ReferenceCard.insertMany(SEED_CARDS);
  console.log(`✅ Seeded ${SEED_CARDS.length} reference cards`);

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
