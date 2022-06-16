// module.exports = func = (req, res, next) => {
//     return (req, res, next) => {
//         func(req, res, next).catch(next);
//     }
// }


const wrapAsync = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = wrapAsync;



