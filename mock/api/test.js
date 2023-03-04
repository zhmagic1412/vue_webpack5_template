module.exports = {
    url: "test",
    type: "get",
    response: (req) => {
        return {
            code: 20000,
            message: 'ok',
            data: 'test result'
        }
    }
}