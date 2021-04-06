import { Component } from '@angular/core';

type Player1 = 'Player' | 'P1';
type Player2 = 'CPU' | 'P2';
type StartButtonMessage = 'START' | 'RESET' | 'NEW GAME';
const victoryPositions: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    // console.log(props);
  }
  playerCountWins: number[] = [0, 0];
  playerNick: [Player1, Player2] = ['Player', 'CPU'];
  currentPlayerTurn: number = 0;
  msgButtonStart: StartButtonMessage = 'START';
  countCurrentPlay: number = 0;
  values: string[] = ['', '', '', '', '', '', '', '', ''];
  winPosition: number[] = [];

  changeGameType(event: any) {
    const value = parseInt(event.target.value);
    this.currentPlayerTurn = 0;
    this.playerCountWins[0] = 0;
    this.playerCountWins[1] = 0;
    this.playerNick = value == 1 ? ['Player', 'CPU'] : ['P1', 'P2'];
    this.reset();
  }

  whenClicked(event: any) {
    const divId = parseInt(event.target.id.replace('field', ''));
    this.values[divId] = this.currentPlayerTurn === 0 ? 'X' : 'O';
    this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1;
    this.countCurrentPlay++;
    if (this.countCurrentPlay === 9) {
      this.msgButtonStart = 'NEW GAME';
    } else {
      this.msgButtonStart = 'RESET';
    }
    victoryPositions.map((element) => {
      const [pos1, pos2, pos3] = element;
      if (
        this.values[pos1] === this.values[pos2] &&
        this.values[pos2] === this.values[pos3] &&
        this.values[pos1]
      ) {
        this.winPosition = element;
        this.setVictory();
        return;
      }
    });
  }

  newGame() {
    if (this.countCurrentPlay < 9 && !this.winPosition.length) {
      this.playerCountWins[this.currentPlayerTurn]--;
    }
    this.msgButtonStart = 'RESET';
    this.reset();
  }

  setVictory() {
    this.msgButtonStart = 'NEW GAME';
    this.playerCountWins[this.currentPlayerTurn ? 0 : 1]++;
    this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1;
  }

  reset() {
    this.values.forEach((element, index) => {
      this.values[index] = '';
    });
    this.countCurrentPlay = 0;
    this.winPosition = [];
  }
}
