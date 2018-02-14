export interface Ruleset {
  wordsNeeded: number;
  questionMarksNeeded: number;
}

export class PrepareGameRuleset {

  constructor() {
  }

  public getRolesNeeded(gamePlayerSize: number): Ruleset {

    const notSupporedModel: Ruleset = {
      wordsNeeded: 0,
      questionMarksNeeded: 0
    };

    const ruleSet: {[playerSize: number]: Ruleset} = {
      4: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 1
      },
      5: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 1
      },
      6: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 2
      },
      7: {
        wordsNeeded: 6 / 2,
        questionMarksNeeded: 1
      },
      8: {
        wordsNeeded: 6 / 2,
        questionMarksNeeded: 2
      }
    };

    return ruleSet[gamePlayerSize] ? ruleSet[gamePlayerSize] : notSupporedModel;
  }

}
