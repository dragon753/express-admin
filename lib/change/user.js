var pwd = require('pwd'),
    fs = require("fs"),
    path = require('path');


/**
 * change password for current user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {String} oldpass
 * @param {String} newpass
 * @param {Function} callback
 * @return {Object} user
 * @api public
 */

exports.change = function (req, res, oldpass, newpass, cb) {
    var user = req.session.user;

    if(!validatePassword(newpass)){
        return cb(new Error('Password must contains at least: 2 lower case letters, 2 upper case letters  and 2 digits'));
    }

    pwd.hash(oldpass, user.salt, function(err, hash){
        if(err) return cb(err, null);

        if(user.hash!=hash){
            return cb(new Error("wrong old password"), null);
        }

        pwd.hash(newpass, function (err, salt, hash) {
            if (err) return cb(err);
            user.hash = hash;
            user.salt = salt;
            res.locals._admin.users[user.name] = user;

            fs.writeFileSync(path.join(res.locals._admin.dpath, 'users.json'),
                JSON.stringify(res.locals._admin.users, null, 4), 'utf8');
            cb(null, user);
        });
    })
}

var validatePassword = function (input) {
    function check (regex) {
        var match = input.match(regex);
        if (match && match.length > 1) return true;
        return false;
    }
    return check(/[A-Z]/g) && check(/[a-z]/g) && check(/[0-9]/g)
        ? true : false;
}
