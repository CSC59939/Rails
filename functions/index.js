// =========================================================
// DON'T CHANGE IMPORTS / INITIALIZER
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
var serviceAccount = require("./rails-private-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rails-students.firebaseio.com"
});
// ==========================================================

exports.signup = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const reqData = req.body;
    if (reqData && 
        reqData.email && 
        reqData.name && 
        reqData.password && 
        reqData.universities &&
        reqData.type) {
      if (reqData.type !== 'student' && reqData.type !== 'teacher') {
        res.status(400).send('Invalid User Type.');
      }
      admin.auth().createUser({
        email: reqData.email,
        displayName: reqData.name,
        password: reqData.password
      }).then((user) => {
          console.log(user.uid);
          admin.firestore().collection('users').doc(user.uid).set({
            type: reqData.type,
            universities: reqData.universities
          }).then(()=>{
            res.status(200).send('User created');
            return;
          }).catch((err) => {
            console.log(err);
            admin.auth().deleteUser(user.uid).then(()=>{
              res.status(300).send('Try creating again.');
              return;
            }).catch((er) => {
              res.status(300).send('Created with error. Needs fix.');
            })
          });
          return;
      }).catch((err) => {
        if (err) {
          console.log(err.message);
          res.status(400).send(err);
        }
      });
    } else {
      console.log(reqData);
      res.status(500).send('Invalid Request.');
    }
  });
});

// exports.getUserData = functions.https.onRequest((req, res) => {
//   return cors((req, res) => {
//     const reqData = req.body;
//     if (re)
//   });
// })

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
