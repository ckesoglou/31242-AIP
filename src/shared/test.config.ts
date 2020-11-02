import sequelize from "@daos/DBInstance";

export const request = require("supertest");
export const APP = "https://ioweyou.tech";
export const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};
export const TESTUSER2 = {
  username: "testunittestusr2",
  displayName: "testunittestusr2",
  password: "Testunittestusr2!",
};

const TESTUSER3 = {
  username: "testunittestusr3",
  displayName: "testunittestusr3",
  password: "Testunittestuser3!",
};

const TESTUSER4 = {
  username: "testunittestusr4",
  displayName: "testunittestusr4",
  password: "Testunittestuser4!",
};

const TESTUSER5 = {
  username: "testunittestusr5",
  displayName: "testunittestusr5",
  password: "Testunittestuser5!",
};

const TESTUSER6 = {
  username: "testunittestusr6",
  displayName: "testunittestusr6",
  password: "Testunittestuser6!",
};

const TESTUSER7 = {
  username: "testunittestusr7",
  displayName: "testunittestusr7",
  password: "Testunittestuser7!",
};

const TESTUSER8 = {
  username: "testunittestusr8",
  displayName: "testunittestusr8",
  password: "Testunittestuser8!",
};

export const TESTUSERARRAY = [
  TESTUSER,
  TESTUSER3,
  TESTUSER4,
  TESTUSER5,
  TESTUSER6,
  TESTUSER7,
  TESTUSER8,
];

export const ITEMID = "814120d4-5d3a-464b-8040-a9fecc107e54"; // Coffee

// Create test users in database
export async function createTestUsers() {
  await request(APP)
    .post("/api/signup")
    .send({
      username: `${TESTUSER.username}`,
      displayName: `${TESTUSER.displayName}`,
      password: `${TESTUSER.password}`,
    });
  await request(APP)
    .post("/api/signup")
    .send({
      username: `${TESTUSER2.username}`,
      displayName: `${TESTUSER2.displayName}`,
      password: `${TESTUSER2.password}`,
    });
}

// Get cookie for authorised user
export async function getAuthenticatedUserCookie() {
  const resLogin = await request(APP)
    .post("/api/login")
    .send({
      username: `${TESTUSER.username}`,
      password: `${TESTUSER.password}`,
    });
  if (resLogin.body.errors) {
    const resSignUp = await request(APP)
      .post("/api/signup")
      .send({
        username: `${TESTUSER.username}`,
        displayName: `${TESTUSER.displayName}`,
        password: `${TESTUSER.password}`,
      });
    console.log(resSignUp.headers["set-cookie"]);
    return resSignUp.headers["set-cookie"];
  } else {
    console.log(resLogin.headers["set-cookie"]);
    return resLogin.headers["set-cookie"];
  }
}

// Delete test users from database
export async function deleteTestUsers() {
  await sequelize.query(
    `DELETE from ious WHERE giver='${TESTUSER.username}' OR receiver='${TESTUSER.username}';
        DELETE from tokens WHERE username='${TESTUSER.username}';
        DELETE from users WHERE username='${TESTUSER.username}';`
  );
  await sequelize.query(
    `DELETE from ious WHERE giver='${TESTUSER2.username}' OR receiver='${TESTUSER2.username}';
        DELETE from tokens WHERE username='${TESTUSER2.username}';
        DELETE from users WHERE username='${TESTUSER2.username}';`
  );
}
