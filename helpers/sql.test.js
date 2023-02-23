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

    test("Data not Valid", function() {
        let dataToUpdate = {};
        let jsToSql = [];
        expect(sqlForPartialUpdate(dataToUpdate,jsToSql)).toThrow(BadRequestError("No data"),400);


        
    })

});