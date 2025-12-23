
export enum GameState {
  WAIT = 'WAIT',
  SHUFFLING = 'SHUFFLING',
  SELECTING = 'SELECTING',
  FLIPPING = 'FLIPPING',
  RESULT = 'RESULT'
}

export interface TarotCard {
  id: number;
  name: string;
  keyword: string;
  type: 'major' | 'minor' | 'court';
  suite?: 'Wands' | 'Cups' | 'Swords' | 'Disks';
  imageUrl: string;
}

export interface SelectedCardInfo {
  card: TarotCard;
  isReversed: boolean;
}
