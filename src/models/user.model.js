const users = [];
//user들의 정보를 담을 배열

// 유저가 접속하면 호출되는 함수
const addUser = (user) => {
  users.push(user);
};

// 유저가 접속 해제 할 때 호출되는 함수
const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  // 접속을 종료 할려는 Client(유저)의 index를 가져옵니다.
  if (index !== -1) return users.splice(index, 1)[0];
  // index -1이 아닌 상황에서는 users.splice(index, 1)로 그 index에서 1개를 지워줍니다.
  // -> 그 유저 정보 삭제
  // 그리고 남은 users 배열을 return 해줍니다.
  // 만약 -1이라면, 해당 유저가 users 배열에 없는 대상이라(사실 오류인 상황)
};

const getUser = () => {
  return users;
};

export { addUser, getUser, removeUser };
