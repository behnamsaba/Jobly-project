"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle}
   *
   * Returns { title, salary, equity, company_handle}
   *
   * 
   * */

  static async create({ title, salary, equity, company_handle}) {

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id,title, salary, equity, company_handle`,
        [
          title,
          salary,
          equity,
          company_handle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs with filtering
   *
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll(reqQuery) {
    const jobsRes = await db.query(
          `SELECT id,title,salary,equity,company_handle FROM jobs`);
    const jobs = jobsRes.rows;
    
    let queryString = Object.keys(reqQuery);
    if (queryString.length === 0){
      return jobs;
    }
    if(queryString.includes('title')){
      const search = jobs.filter(j => j.title.toLowerCase().includes(reqQuery.title.toLowerCase()));
      return search;
    }else if(queryString.indexOf("minSalary") > -1){
      const minSalary = parseInt(reqQuery.minSalary);
      const search = jobs.filter(j => j.salary > minSalary);
      return search;
    }
    const equity = parseInt(reqQuery.hasEquity);
    if(equity === 0){
        return jobs;
    }else{
        const search = jobs.filter(j => (j.equity > 0) && (j.equity <= equity));
        return search;
    }

  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle
           FROM jobs
           WHERE id = $1`,
        [id]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No Job: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
            title: "title",
            salary: "salary",
            equity: "equity"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No Job: ${id}`);
  }
}


module.exports = Job;
