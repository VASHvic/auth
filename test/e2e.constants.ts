export const randomMockUser = (Math.random() + 1).toString(36).substring(7);

export const newMockUser = {
  name: randomMockUser,
  email: `${randomMockUser}@mail.com`,
  password: `${randomMockUser}`,
};
export const newMockUserBadInput = {
  name: randomMockUser + "1",
  email: `${randomMockUser}@gmail.com`,
  password: `BAD${randomMockUser}1`,
};

export const newMockUserNoPass = {
  name: randomMockUser,
  email: `${randomMockUser}@mail.com`,
};

export const updatedMockUserDto = {
  name: randomMockUser,
  email: `${randomMockUser}@mail.com`,
  password: `${randomMockUser}`,
  newName: randomMockUser + "1",
  newPassword: `${randomMockUser}1`,
  newEmail: `${randomMockUser}@gmail.com`,
};
export const updatedMockUser = {
  nameame: randomMockUser + "1",
  password: `${randomMockUser}1`,
  email: `${randomMockUser}@gmail.com`,
};
