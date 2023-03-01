const { BadRequestError } = require("../expressError");

/** 
in order to prevent SQL Injection, avoid code duplication, puting javascript name to postgres name in our database correctly we transform array to object then use it 
in user and company models
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
