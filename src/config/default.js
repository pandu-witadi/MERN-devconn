//
//
//
let CF = {
    app: {
        name: "MERN-devconn",
        version: "0.0.1"
    },

    server: {
        port: 5152,
        apiPath: '/api'
    },

    // mongodb setting
    mongoose: {
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        // url : 'mongodb+srv://wamoo:wamoo@devconnector.jdg80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        url : 'mongodb://127.0.0.1:27017/devcon'
    },

    // JWT (JSONWebToken)
    jwt: {
       saltLength: 10,
       secret_str : "this-auth-token",
       token_exp:  10 * 60 // 10 minutes
    },
    frontEnd: {
        path: '../client_react/build'
    }
}


module.exports = CF
