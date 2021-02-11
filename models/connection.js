var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,

    useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin_capsule_test:lacapsule@lacapsule.xqzrl.mongodb.net/bikeshop?retryWrites=true&w=majority',
    options,
    function(err) {
        console.log(err);
    }
);