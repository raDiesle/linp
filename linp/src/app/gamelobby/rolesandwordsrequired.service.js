"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let RolesandwordsrequiredService = class RolesandwordsrequiredService {
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
};
RolesandwordsrequiredService = __decorate([
    core_1.Injectable()
], RolesandwordsrequiredService);
exports.RolesandwordsrequiredService = RolesandwordsrequiredService;
