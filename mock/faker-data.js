const faker = require("faker");
const _ = require("lodash");

faker.locale = "zh_CN";

module.exports = function () {
    return {
        test: {
            code: "",
            data: {
                a: 1,
                b: "aa"
            },
            msg: "success",
            total: 3,
            type: 0
        }
    }
};