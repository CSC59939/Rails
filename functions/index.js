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

/* eslint promise/no-nesting: 0 */

exports.signup = functions.https.onRequest((req, res) => {
  /*
    input = {
      email: '1@email.com',
      name: 'Full Name',
      password: 'topsecret',
      universities: ['College Name', 'College Name 2'], -- NOT NECESSARY
      type: 'student // EITHER 'student' or 'teacher' -- ALL SMALL CASE
    }
  */
  return cors(req, res, () => {
    const reqData = req.body;
    if (reqData && 
        reqData.email && 
        reqData.name && 
        reqData.password && 
        reqData.type) {
      if (reqData.type !== 'student' && reqData.type !== 'teacher') {
        res.status(400).send({message: 'Invalid user type.'});
      }
      admin.auth().createUser({
        email: reqData.email,
        displayName: reqData.name,
        password: reqData.password
      }).then((user) => {
          admin.database().ref('users/'+user.uid).set({
            type: reqData.type
          }).then(() => {
            res.status(200).send({message: 'Signed up successfully.'});
            return;
          }).catch((err) => {
            res.status(300).send(err);
          });
          return;
      }).catch((err) => {
        if (err) {
          res.status(400).send(err);
        }
      });
    } else {
      console.log(reqData);
      res.status(500).send({message: 'Invalid Request.'});
    }
  });
});

exports.getclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      universityName: 'College Name'
    }

    output = {
      classUniqueId : {
        name: 'CSC 59939(L)',
        instructorName: 'John Doe',
        approvedEmails: [ '1@email.com', '2@email.com' ]
      },
      classUniqueId2 : {
        name: 'CSC 30100 (GH)',
        instructorName: 'Jim Halpert',
        approvedEmails: [ '3@email.com', '4@email.com' ]
      },
    }
  */
  return cors(req, res, () => {
    if (reqData && reqData.universityName && (reqData.universityName !== '')) {
      admin.database().ref(`universities/${reqData.universityName}`).once('value')
      .then((snap) => {
        if (snap.val()) {
          const universityData = snap.val();
          var classes = {};
          for (var c in universityData) {
            classes[c] = {
              name: universityData.name,
              instructorName: universityData.instructorName,
              approvedEmails: universityData['approved-emails'],
            };
          }
          res.status(200).send(c);
          return;
        } else {
          res.status(300).send({message: 'No classes exist.'})
        }
        return;
      }).catch((getErr) => {
        res.status(400).send(getErr);
      })
    } else {
      res.status(500).send({message: 'Select a University.'})
    }
  });
});

exports.joinclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      universities: {
        'College Name': [' classUID' ]
      },
      token: getIdToken // https://firebase.google.com/docs/auth/admin/verify-id-tokens,
      uid: firebase.auth().currentUser.uid
    }
  */
  return cors(req, res, () => {
    const reqData = req.body;
    if(reqData &&
      reqData.universities &&
      reqData.uid &&
      reqData.token) {
        admin.auth().verifyIdToken(reqData.token).then(() => {
          admin.database().ref(`users/${reqData.uid}/universities`)
          .once('value').then((snap) => {
            var existing = snap.val();
            if (existing) {
              for (var uni in reqData.universities) {
                if (uni in existing) {
                  existing[uni] = existing[uni].concat(reqData.universities[uni]);
                } else {
                  existing[uni] = reqData.universities[uni];
                }
              }
            } else {
              existing = reqData.universities;
            }
            admin.database().ref(`users/${reqData.uid}/universities`).set(existing)
            .then(() => {
              res.status(200).send({message: 'Joined class.'});
              return;
            }).catch((writeErr) => {
              res.status(300).send(writeErr);
              return;
            });
            return;
          }).catch((getErr) => {
            res.status(350).send(getErr);
            return;
          });
          return;
        }).catch((authErr) => {
          res.status(400).send(authErr);
          return;
        });
      } else {
        res.status(500).send({message: 'Try signing out and in again.'});
        return;
      }
  });
});

exports.createclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      token: getIdToken // https://firebase.google.com/docs/auth/admin/verify-id-tokens,
      university: 'College Name',
      classData: {
        name: 'CSC 59939 (L)',
        instructor: firebase.auth().currentUser.uid,
        instructorName: firebase.auth().currentUser.displayName,
        approvedEmails: ['1@email.com', '2@email.com'],
        meetingTimes: {
          from: '10:00',
          to: '13:00'
        }
      }
    }
  */
  return cors(req, res, () => {
    const reqData = req.body;
    if (reqData &&
        reqData.token &&
        reqData.university && (reqData.university !== '') && 
        reqData.classData) {
          admin.auth().verifyIdToken(reqData.token).then(() => {
            const cData = {
              name: reqData.classData.name,
              instructor: reqData.classData.uid,
              instructorName: reqData.classData.displayName,
              meetingTimes: reqData.classData.meetingTimes,
            };
            cData['approved-emails'] = reqData.classData.approvedEmails;
            admin.database().ref(`universities/${reqData.university}`).push(cData)
            .then(() => {
              res.status(200).send({message: 'Class created.'});
              return;
            }).catch((pushErr) => {
              res.status(300).send(pushErr);
              return;
            });
            return;
          }).catch((authErr) => {
            res.status(400).send({message: 'Try signing out and in again.'})
          });
        } else {
          res.status(500).send({message: 'Invalid Request.'});
          return;
        }
  });
});



// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// curl -i -X POST -H 'Content-Type: application/json' -d "{"email":"student1@email.com","name":"Student 1 Name","password":"studentpassword","universities":["CUNY City College","CUNY York College"],"type":"student"}" http://localhost:5000/rails-students/us-central1/signup
// curl -i -X POST -H 'Content-Type: application/json' -d "{"email":"student1@email.com","name":"Student 1 Name","password":"studentpassword","universities":["CUNY City College","CUNY York College"],"type":"student"}" http://localhost:5000/rails-students/us-central1/createclass
// curl -i -X POST -H 'Content-Type: application/json' -d "{"email":"student1@email.com","name":"Student 1 Name","password":"studentpassword","universities":["CUNY City College","CUNY York College"],"type":"student"}" http://localhost:5000/rails-students/us-central1/getclass
// curl -i -X POST -H 'Content-Type: application/json' -d "{"email":"student1@email.com","name":"Student 1 Name","password":"studentpassword","universities":["CUNY City College","CUNY York College"],"type":"student"}" http://localhost:5000/rails-students/us-central1/joinclass
