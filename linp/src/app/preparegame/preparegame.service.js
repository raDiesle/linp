"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PreparegameService {
    constructor() {
    }
    getRolesNeeded(gamePlayerSize) {
        const notSupporedModel = {
            wordsNeeded: 0,
            questionMarksNeeded: 0
        };
        const ruleSet = {
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
exports.PreparegameService = PreparegameService;
