import {Role, Selector} from 'testcafe';

const url = 'http://localhost:4200';

let loginByPlayer = async function (t, userEmail) {
  await t
    .click('#welcome')

    .click('button[data-provider-id="password"]')    
    .typeText('input[name="email"]', userEmail, {replace: true})
    .click('button[type="submit"]')    
    .typeText('input[type="password"]', 'pass123')
    .click('button[type="submit"]')
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
