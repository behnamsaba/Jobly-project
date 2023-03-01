"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  importedJobs,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  let newJob = {
    company_handle: "c1",
    title: "Test",
    salary: 100,
    equity: "0.1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number),
    });
  });
});

describe("findAll", function () {
  test("findall  without search", async function () {
    let jobs = await Job.findAll({});
    expect(jobs).toEqual([
      {
        id:expect.any(Number),
        title: "j1",
        salary: 1000,
        equity: "0",
        company_handle: "c1"
      },
      {
        id:expect.any(Number),
        title: "j2",
        salary: 1200,
        equity: "1",
        company_handle: "c2"
      }
    ]);
  });
  test("search by title", async function () {
    let jobs = await Job.findAll({title:"j2"});
    expect(jobs).toEqual([{id:expect.any(Number), "title": "j2", "salary": 1200,  equity: "1",company_handle: "c2"}]);


  })
  test("search by minSalary",async function () {
    let jobs = await Job.findAll({minSalary:1100});
    expect(jobs).toEqual([{id:expect.any(Number), "title": "j2", "salary": 1200,  equity: "1",company_handle: "c2"}]);
  })
});



/************************************** get */

describe("get", function () {
  test("get single job", async function () {
    let Alljobs = await Job.findAll({});
    let singlejob = await Job.get(Alljobs[0].id);
    expect(singlejob).toEqual(singlejob);
  });
});

  test("updates a job", async () => {  
    const data = { title: "updated", salary: 200000 };
    let Alljobs = await Job.findAll({});
    const updatedJob = await Job.update(Alljobs[0].id, data);

    expect(updatedJob).toEqual({ ...Alljobs[0], title: "updated", salary: 200000});  
  });

  
  describe('remove a job', () => {
    test('should remove a job with the given id', async () => {
      let Alljobs = await Job.findAll({});
      const delJob = await Job.remove(Alljobs[0].id)
      expect(delJob).toEqual(undefined); //not return anything , del msg return in route , not in model
    });
  });
