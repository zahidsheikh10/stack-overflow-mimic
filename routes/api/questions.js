const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question Model
const Question = require("../../models/Question");

// @type    GET
//@route    /api/questions
// @desc    route for displaying all questions
// @access  PUBLIC

router.get('/', (req, res) => {
    Question.find().sort({date: -1})
        .then(question => res.json(question))
        .catch(error => res.json({noquestion : 'No Questions For Display'}))
})
// @type    POST
//@route    /api/questions/
// @desc    route for submiting questions
// @access  PRIVATE

router.post('/', passport.authenticate('jwt',{ session:false }),(req,res) => {
    const newQuestion = new Question({
        textone:req.body.textone,
        texttwo: req.body.texttwo,
        user: req.user.id,
        name:req.body.name
    });
    newQuestion.save()
        .then(question => res.json(question))
        .catch(error => {console.log('Unable to save question to database' + error)})
})

// @type    POST
//@route    /api/questions/answers/:id
// @desc    route for submiting answers to questions
// @access  PRIVATE
router.post('/answers/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Question.findById(req.params.id)
    .then(question => {
        const newAnswer = {
            user: req.user.id,
            name: req.body.name,
            text: req.body.text
        };
        question.answers.unshift(newAnswer)
        question.save()
            .then(question => res.json(question))
            .catch(error => {console.log(error)})

    })
    .catch(error => console.log(error))
});


// @type    POST
//@route    /api/questions/upvote/:id
// @desc    route for upvoting
// @access  PRIVATE

router.post('/upvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Question.findById(req.params.id)
                .then(question => {
                    if(question.upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0){
                        // return res.status(400).json({noupvote: 'User already upvoted'})
                        question.upvotes.shift({ user: req.user.id})
                        question.save()
                            .then(question => res.json(question))
                            .catch(error => { console.log(error) })
                    }
                    else{
                        question.upvotes.unshift(({ user: req.user.id }))
                        question.save()
                            .then(question => res.json(question))
                            .catch(error => { console.log(error) })
                    }
                })
                .catch(error => {console.log(error)})
        })
        .catch(error => console.log(error))
})

module.exports = router;