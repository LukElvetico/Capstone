export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); 
};


export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404).json({
            message: 'Risorsa non trovata o ID non valido.',
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
        return;
    }
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};