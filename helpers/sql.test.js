const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");


describe("SQL injection object", function () {
    test("Create object", function (){
        const dataToUpdate = { firstName: 'test_first', lastName: 'last_test' }
        const jsToSql = { firstName: 'first_name', lastName: 'last_name', isAdmin: 'is_admin' };
        const result = {
            setCols: '"first_name"=$1, "last_name"=$2',
            values: [ 'test_first', 'last_test' ]
          };

        const test = sqlForPartialUpdate(dataToUpdate,jsToSql);
        expect(test).toEqual(result);
    });

    test("should throw an error if no data is passed", function() {
        let dataToUpdate = {};
        let jsToSql = [];
        expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrowError(BadRequestError);
    })
    test("returns setCols with correct column names when jsToSql is provided", function () {
        const dataToUpdate = { firstName: "Aliya", age: 32 };
        const jsToSql = { firstName: "first_name" };
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(result.setCols).toContain(`"first_name"=$1`);
      });
      
      test("returns setCols with correct column names when jsToSql is not provided", function () {
        const dataToUpdate = { firstName: "Aliya", age: 32 };
        const jsToSql = {};
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(result.setCols).toContain(`"firstName"=$1`);
      });

});