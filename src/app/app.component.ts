import { Component } from '@angular/core';
import { element } from 'protractor';

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
const currentYear = new Date().getFullYear();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  playerCountWins: number[] = [0, 0];
  playerNick: [Player1, Player2] = ['Player', 'CPU'];
  currentPlayerTurn: number = 0;
  msgButtonStart: StartButtonMessage = 'START';
  countCurrentPlay: number = 0;
  values: string[] = ['', '', '', '', '', '', '', '', ''];
  winPosition: number[] = [];
  messageStatus: string = 'Current turn: ' + this.playerNick[0];
  date: string = '2021' + (currentYear > 2021 ? ` - ${currentYear}` : '');

  changeGameType(event: any) {
    const value = parseInt(event.target.value);
    this.currentPlayerTurn = 0;
    this.playerCountWins[0] = 0;
    this.playerCountWins[1] = 0;
    this.playerNick = value == 1 ? ['Player', 'CPU'] : ['P1', 'P2'];
    this.msgButtonStart = 'START';
    this.reset();
  }

  whenClicked(event: any) {
    if (!this.winPosition.length) {
      const divId = parseInt(event.target.id.replace('field', ''));
      this.values[divId] = this.currentPlayerTurn === 0 ? 'X' : 'O';
      this.updateGame();
    }
  }

  updateGame() {
    this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1;
    this.countCurrentPlay++;
    if (this.countCurrentPlay === 9) {
      this.msgButtonStart = 'NEW GAME';
      this.messageStatus = 'Tie';
    } else {
      this.msgButtonStart = 'RESET';
      this.messageStatus =
        'Current turn: ' + this.playerNick[this.currentPlayerTurn];
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
    this.botGameplay();
  }

  newGame() {
    if (this.countCurrentPlay < 9 && !this.winPosition.length) {
      this.playerCountWins[this.currentPlayerTurn]--;
    }
    this.msgButtonStart = 'RESET';
    this.reset();
    this.botGameplay();
  }

  setVictory() {
    this.msgButtonStart = 'NEW GAME';
    this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1;
    this.playerCountWins[this.currentPlayerTurn]++;
    this.messageStatus = 'Winner: ' + this.playerNick[this.currentPlayerTurn];
  }

  reset() {
    this.values.forEach((element, index) => {
      this.values[index] = '';
    });
    this.messageStatus =
      'Current turn: ' + this.playerNick[this.currentPlayerTurn];
    this.countCurrentPlay = 0;
    this.winPosition = [];
  }

  botMove(pos: number) {
    setTimeout(() => {
      this.values[pos] = 'O';
      this.updateGame();
    }, 500);
  }

  chancesToWin(icon: 'X' | 'O'): { victoryIndex: number; total: number }[] {
    const opponent = icon === 'X' ? 'O' : 'X';
    const chances = victoryPositions
      .map((vPos, index) => {
        const arrayCountReturn = vPos
          .map((v) => {
            //Ignore full line if has O in line
            if (this.values[v] === opponent) return -1;
            //Ignore field if is empty
            // if (this.values[v] !== icon) return 0;
            //Count more 1 if is
            if (this.values[v] === icon && vPos.includes(v)) return 1;
            //else
            return 0;
          })
          //Remove when empty
          .filter((value) => {
            return value !== 0;
          });
        //Ignore full line if has O
        const count = arrayCountReturn.find((element) => {
          return element === -1;
        })
          ? 0
          : arrayCountReturn.length;
        return { victoryIndex: index, total: count };
      })
      //Sort by higher chances
      .sort((a, b) => b.total - a.total);
    return chances.filter((element) => element.total === chances[0].total);
  }

  botGameplay() {
    //If is the bot turn
    if (
      this.playerNick[this.currentPlayerTurn] === 'CPU' &&
      this.countCurrentPlay < 9 &&
      !this.winPosition.length
    ) {
      //Get a random number
      function getRandomNumber(max: number) {
        return Math.ceil(Math.random() * max) - 1;
      }
      //Get all emptyFields
      const emptyFields: number[] = this.values
        .map((element, index) => {
          if (element === '') return index;
          return -1;
        })
        .filter((index) => index !== -1);
      //Last move
      if (emptyFields.length === 1) {
        this.botMove(emptyFields[0]);
        return;
      }
      //If not the last move
      //Get all X fields
      const xPositions: number[] = this.values
        .map((element, index) => {
          if (element === 'X') return index;
          return -1;
        })
        .filter((index) => index !== -1);
      if (xPositions.length === 1 && [0, 2, 6, 8].includes(xPositions[0])) {
        const countInputs = this.values.filter((element) => element !== '')
          .length;
        if (countInputs === 1) {
          this.botMove(4);
          return;
        }
      } else if (
        xPositions.length === 2 &&
        [0, 2, 6, 8].includes(xPositions[0]) &&
        [0, 2, 6, 8].includes(xPositions[1])
      ) {
        const countInputs = this.values.filter((element) => element !== '')
          .length;
        if (countInputs === 3) {
          if (this.values[0] && this.values[0] === this.values[8]) {
            const nextPositions = [1, 3];
            const index = getRandomNumber(2);
            this.botMove(nextPositions[index]);
            return;
          } else if (this.values[2] && this.values[2] === this.values[6]) {
            const nextPositions = [5, 7];
            const index = getRandomNumber(2);
            this.botMove(nextPositions[index]);
            return;
          }
        }
      }
      //Get the chances to X win
      const xChances = this.chancesToWin('X');
      const oChances = this.chancesToWin('O');
      if (oChances[0].total === 2) {
        const vPos = victoryPositions[oChances[0].victoryIndex];
        const index = vPos.find((pos) => {
          return this.values[pos] === '';
        });
        if (index) this.botMove(index);
        return;
      }
      //Choose one of the victory's X chances
      const xChanceIndex = getRandomNumber(xChances.length);
      const xIndexVictoryChance = xChances[xChanceIndex].victoryIndex;
      //Choosing one move to block the victory position choosed
      //Selecting one possible move in the position choosed
      const xPossibleMoves = victoryPositions[xIndexVictoryChance]
        .map((element) => {
          return { index: element, value: this.values[element] };
        })
        .filter((element) => element.value === '')
        .map((element) => element.index);
      //Index of the move choosed to set
      const oPositionIndex =
        xPossibleMoves[getRandomNumber(xPossibleMoves.length)];
      //Set move
      this.botMove(oPositionIndex);
    }
  }
}
