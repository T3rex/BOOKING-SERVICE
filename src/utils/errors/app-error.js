class AppError extends Error {
    constructor(name, message, description,statusCode){
        super();
        this.name = name;
        this.message = message;
        this.description = description;
        this.statusCode = statusCode;
    }
}

module.exports = AppError;