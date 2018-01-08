import {Selector} from 'testcafe';
import { waitForAngular} from 'testcafe-angular-selectors';
import { ClientFunction } from 'testcafe';
import {testHelper} from "./testHelper";

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

fixture `FirstGuessGameSpec`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t =>{
    await t
      .click('#simulation')
      .typeText('#gameName', gameName)
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('FirstguessGame', async t => {
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForFirstGuessGame')
    .expect(Selector('#createForFirstGuessGameResponseAllFlag').exists).ok()
