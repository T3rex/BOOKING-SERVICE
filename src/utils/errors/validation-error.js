const {StatusCodes } = require('http-status-codes')


class ValidationError extends Error{
    constructor(error){        
        let description = [];
        error.errors.forEach(err =>{
            description.push(err.message);
        })
        this.name = "Validation Error";
        this.message = 'Not able to validate the data send in this request';
        this.description = description;
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError;