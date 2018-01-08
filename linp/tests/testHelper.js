import {Role, Selector} from 'testcafe';

const url = 'http://localhost:4200';

let loginByPlayer = async function (t, userEmail) {
  await t
    .click('#welcome')
    .typeText('#userProfileEmail', userEmail, {replace: true})
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail')
    // .expect(Selector('#loggedInPlayerName').innerText).contains('playerB')
    .expect(Selector('#logout').exists).ok()
};

const playerA = Role(url, async t => {
  await loginByPlayer(t, 'playera@test.de');
}, {preserveUrl: true});
const playerB = Role(url, async t => {
  await loginByPlayer(t, 'playerb@test.de');
}, {preserveUrl: true});
const playerC = Role(url, async t => {
  await loginByPlayer(t, 'playerc@test.de');
}, {preserveUrl: true});
const playerD = Role(url, async t => {
  await loginByPlayer(t, 'playerd@test.de');
}, {preserveUrl: true});
const playerE = Role(url, async t => {
  await loginByPlayer(t, 'playere@test.de');
}, {preserveUrl: true});
const playerF = Role(url, async t => {
  await loginByPlayer(t, 'playerf@test.de');
}, {preserveUrl: true});

export const testHelper = {
  playerA : playerA,
  playerB : playerB,
  playerC : playerC,
  playerD : playerD,
  playerE : playerE,
  playerF : playerF,
  url : url
}
