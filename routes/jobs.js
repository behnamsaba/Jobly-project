"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const { BadRequestError,UnauthorizedError } = require("../expressError");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");
const { Router } = require("express");
const jobSearchSchema = require("../schemas/jobSearch.json");
const jobNewSchema = require("../schemas/jobNew.json");


const router = express.Router();

//get all jobs with and without filtering
router.get('/', async (req,res,next) => {
    try{
        const validator = jsonschema.validate(req.query, jobSearchSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const jobs = await Job.findAll(req.query);
        return res.json({ jobs })
    }catch(err){
        next(err);
    }
})



//get a single job details 
router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
});

/** POST / create company
 * company should be { title, salary, equity, company_handle}
 * Authorization required: login
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;