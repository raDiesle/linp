export class RolesandwordsrequiredService {
// this is duplicated with angular project

    constructor() {
    }

    getRolesNeeded(gamePlayerSize: number) {

        const notSupporedModel = {
            wordsNeeded: 0,
            questionMarksNeeded: 0
        };

        const ruleSet: any = {
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
