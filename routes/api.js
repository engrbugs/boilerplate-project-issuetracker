/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
var shortid = require('shortid');

var issues = [];


var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var currentCollection = 'issue_'+project;

      if (req.body.issue_title == undefined |
          req.body.issue_text == undefined |
          req.body.created_by == undefined ){
        res.status(500)
        res.render('error', { error: 'Required text not filled' })
      }

      var created_on = new Date();
      var updated_on = created_on;
      var open = true;
      var newIssue = {
        issue_title: req.body.issue_title,
        issue_text:  req.body.issue_text,
        created_by:  req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on,
        updated_on,
        open,
        _id: shortid.generate()
      }

      issues.push(newIssue);

      console.log(issues);

      res.json(newIssue)
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var currentCollection = 'issue_'+project;

      const updatedFields = {};
      const notEmpty = value =>(
        value != undefined &
        value != null &
        value != '' )

      Object.keys(req.body).forEach(key => {
        if (notEmpty(req.body[key])) {
          if (key=='open') {
            updatedFields[key] = (req.body[key] != 'false')
          } else {
            updatedFields[key] = req.body[key]
          }
        }
      });

      if (Object.keys(updatedFields).length <= 1) {
        console.log('no updated field sent')
        res.send('no updated field sent')
      } else {
        updatedFields['updated_on'] = new Date();
        let searchedForIssue = issues.find(issue => issue._id === req.body._id);

        if (!searchedForIssue) {
            console.log(err)
            console.log('could not update '+req.body._id)
            res.send('could not update '+req.body._id)
        } else {
            issues =  issues.map(issue => {
              if (issue._id === req.body._id) {
                return {
                  issue_title: issue.issue_title,
                  issue_text: issue.issue_text,
                  created_by: issue.created_by,
                  assigned_to: issue.assigned_to,
                  status_text: issue.status_text,
                  created_on: issue.created_on,
                  open: issue.open,
                  ...updatedFields
                }
              }
            })
        }
        console.log(issues);
  
        res.send('successfully updated')
      }
     
    })
    
    .delete(function (req, res){
      var project = req.params.project;

      const { _id } = req.body;

      if (!_id) {
        return res.json({
          error: '_id not found.'
        })
      }

      issues =  issues.filter(issue => issue._id !== _id);
      
      console.log(issues);

      res.send('deleted '+ _id)
    });
    
};
