const router = require('express').Router();
const bcrypt = require('bcrypt');

// Old SQL-based imports (commented out per Step 8)
// const database = include('databaseConnection');
// const dbModel = include('databaseAccessLayer');
// const dbModel = include('staticData');

// Sequelize models
const userModel = include('models/web_user');
const petModel  = include('models/pet');


// ── GET / ─────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    console.log("page hit");
    try {
        const users = await userModel.findAll({
            attributes: ['web_user_id', 'first_name', 'last_name', 'email']
        });
        if (users === null) {
            res.render('error', { message: 'Error connecting to MySQL' });
        } else {
            res.render('index', { allUsers: users });
        }
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log(ex);
    }
});


// ── POST /addUser ─────────────────────────────────────────────────────────────
router.post('/addUser', async (req, res) => {
    try {
        console.log("form submit");
        const password_hash = await bcrypt.hash(req.body.password, 12);
        let newUser = userModel.build({
            first_name:    req.body.first_name,
            last_name:     req.body.last_name,
            email:         req.body.email,
            password_hash: password_hash
        });
        await newUser.save();
        res.redirect("/");
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log(ex);
    }
});


// ── GET /deleteUser ───────────────────────────────────────────────────────────
router.get('/deleteUser', async (req, res) => {
    try {
        console.log("delete user");
        let userId = req.query.id;
        if (userId) {
            let deleteUser = await userModel.findByPk(userId);
            if (deleteUser !== null) {
                await deleteUser.destroy();
            }
        }
        res.redirect("/");
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log(ex);
    }
});


// ── GET /pets ─────────────────────────────────────────────────────────────────
router.get('/pets', async (req, res) => {
    console.log("pets page hit");
    try {
        const pets = await petModel.findAll({ attributes: ['pet_id', 'name'] });
        res.render('pets', { allPets: pets || [] });
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log(ex);
    }
});


// ── GET /showPets ─────────────────────────────────────────────────────────────
router.get('/showPets', async (req, res) => {
    console.log("showPets page hit");
    try {
        let userId = req.query.id;
        const user = await userModel.findByPk(userId);
        if (user === null) {
            res.render('error', { message: 'Error connecting to MySQL' });
        } else {
            let pets = await user.getPets();
            if (pets.length > 0) {
                let owner = await pets[0].getOwner();
                console.log(owner);
            }
            res.render('pets', { allPets: pets });
        }
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log(ex);
    }
});


module.exports = router;
