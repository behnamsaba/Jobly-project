"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "CEO",
    salary: 20,
    equity: 0,
    company_handle:"c1"
  };

  test("ok for users", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {id:expect.any(Number), title: 'CEO', salary: 20, equity: '0', company_handle: 'c1' }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "CEO"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});



describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
              id : expect.any(Number),
              title: "test",
              salary: 1000,
              equity: "0",
              company_handle: "c2"
            },
          ],
    });
  })
});

test("search by title", async function () {
  const resp = await request(app).get('/jobs').query({title:"test"});
  expect(resp.body).toEqual({
    jobs:
      [
        {
          id: expect.any(Number),
          title: "test",
          salary: 1000,
          equity  : "0",
          company_handle: "c2",
       },
      ]
  });
})


/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/${testJobIds[0].id}`);
    console.log(testJobIds[0].id);
    console.log(resp.body);
    
    expect(resp.body).toEqual(    {
      job: {
        id: testJobIds[0].id,
        title: 'test',
        salary: 1000,
        equity: '0',
        company_handle: 'c2'
      }
    });
  });
  test("not found for no such  an id", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
  
});

