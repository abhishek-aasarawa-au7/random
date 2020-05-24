const user = require("../model/userModel");

userController = {}

userController.create = (req, res) => {
    console.log(req.body)
    if(req.body.password != req.body.confromPassword){
        res.redirect('/register?passwordMiss=true');
    } else {
        const newUser = new user(req.body);
        newUser.save((err, data) => {
        if(err) return res.status(403).redirect('/register?err=true');
        res.status(200).redirect('/login?userAdded=true');
        });
    }
    
};


userController.update = (req, res) => {
    let _id = req.session.userId;
    console.log(_id);
    user.find({_id}, (err, User) => {
        if(err) return res.status(403).render('Err', {err});
        console.log(User);
        if(User.length > 0){
            if(User[0].password === req.body.password){
                if(req.body.name) User[0].name = req.body.name;
                if(req.body.username) User[0].username = req.body.username;
                if(req.body.email) User[0].email = req.body.email;
                if(req.body.password) User[0].password = req.body.password;
                User[0].save((err, data) => {
                    if(err) return res.render('Err', {err});
                    res.status(200).redirect('/login');
                });
            } else {
                res.redirect('/edit?passwordMiss=true');
            }
        } else {
            res.render('Err',{err: 'Server is not connected'});
        }
    });
};


userController.show = (req, res) => {
    let username = req.params.username;
    user.find({username}, (err, User) => {
        if(err) return res.status(403).send(err);
        if(User.length > 0){
            res.status(200).render('profile', {user: User[0]});
        } else {
            res.render('Err', {err: `There are no details related to username ${username}`});
        }  
    });
};


userController.delete = (req, res) => {
    let _id = req.session.userId;
    user.find({_id}, (err, User) => {
        if(err) return res.status(403).render('Err', {err});
        if(User.length > 0){
            User[0].remove((err) => {if(err) return res.status(403).render('Err', {err});
            req.session.destroy();
            res.clearCookie('connect.sid');
            res.status(200).redirect('/');
            });
        } else {
            res.render('Err',{err: 'Server is not connected'});
        }
    });
};


userController.login = (req, res) => {
    let username = req.body.username;
    user.find({username}, (err, User) => {
        if(err) return res.status(403).render('err', {err});
        if(User.length > 0 && User[0].password === req.body.password){
            req.session.userId = User[0]._id;
            console.log(req.session.userId);
            res.status(200).render('userHome', {name: User[0].name, username});
        } else {
            res.status(403).redirect('/login?loginFailed=true')
        }
    });
};


userController.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
}


module.exports = { userController };