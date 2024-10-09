import { clearMonsters, getMonsters } from '../models/monster.model.js';
// import { setScore, getScore } from '../models/score.model.js';

export const gameStart = async (uuid, payload) => {
  //
};

export const gameEnd = async (userId, payload) => {
  const userMonsters = getMonsters(userId);

  if (!userMonsters) {
    return { status: 'fail', message: 'Monsters not found' };
  }

  let verificationScore = 0;
  for (let i = 0; i < userMonsters.length; i++) {
    verificationScore += (userMonsters[i].level + 1) * 100;
  }
  if (verificationScore !== payload.score) {
    return { status: 'fail', message: 'Score verification failed' };
  }
  return { status: 'success', message: 'Game Over' };
};