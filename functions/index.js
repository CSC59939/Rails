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
  /*
    input = {
      email: '1@email.com',
      name: 'Full Name',
      password: 'topsecret',
      type: 'student // EITHER 'student' or 'teacher' -- ALL SMALL CASE
    }
  */
  function addToDatabase(uid, type) {
    admin.database().ref(`users/${uid}`).set({type: type})
    .then(()=> {
      res.status(200).send({message: 'Signed up successfully'});
    }).catch((err) => {
      res.status(400).send({message: 'Something went wrong.', error: err});
    });
  }
  return cors(req, res, () => {
    const { name, email, password, type } = req.body;
    if (!(name && email && password && type)) {
      res.status(400).send({message: 'Missing fields.'});
    } else {
      admin.auth().createUser({
        email: email,
        displayName: name,
        password: password
      }).then((user) => {
        if (user) {
          return addToDatabase(user.uid, type);
        }
      }).catch((err) => {
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});

exports.getclasses = functions.https.onRequest((req, res) => {
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
    const {universityName} = req.body;
    if (!universityName) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`universities/${universityName}`)
      .once('value')
      .then((snap) => {
        if (snap.val()) {
          const uniData = snap.val();
          var processedData = {};
          Object.keys(uniData).forEach((key)=>{
            const { approvedEmails, description, instructorName, meetingTimes, name } = uniData[key];
            processedData[key] = {approvedEmails, description, instructorName, meetingTimes, name};
          });
          res.status(200).send({message: 'Classes found.', classList: processedData});
        } else {
          res.status(300).send({message: `No classes found for ${universityName}`});
        }
      }).catch((err) => {
        res.status(400).send({message: 'Something went wrong', error: err});
      });
    }
  });
});

exports.joinclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      universityName: 'CUNY City College',
      classUid: '-LQWgfjv3_rpeEQQwJSv',
      studentData: {
        email: 'student@email.com',
        uid: 'b74c0Ed7sSbLf552CrsGW80t18e2',

      }
    }
  */

  function updateStudentProfile(query, classList) {
    const { universityName, studentData } = query;
    admin.database().ref(`users/${studentData.uid}/universities/${universityName}`)
    .set(classList)
    .then(()=>{
      res.status(200).send({message: 'Successfully joined class.'});
    })
    .catch((err) => {
      res.status(400).send({message: 'Something went wrong updating student profile.', error: err});
    });
  }

  function addToStudentProfile (query) {
    const { universityName, classUid, studentData } = query;
    console.log(`\tusers/${studentData.uid}/universities/${universityName}`);
    admin.database().ref(`users/${studentData.uid}/universities/${universityName}`)
    .once('value')
    .then((snap) => {
      var userClassList = snap.val();
      if (userClassList && userClassList.length > 0) {
        if (userClassList.indexOf(classUid) === -1) userClassList.push(classUid);
        else res.status(200).send({message: 'Already joined this class'});
      } else {
        userClassList = [classUid];
      }
      console.log(userClassList);
      return updateStudentProfile(query, userClassList);
    })
    .catch((err) => {
      res.status(400).send({message: 'Something went wrong adding to student profile.', error: err});
    });
  }

  return cors(req, res, () => {
    const { universityName, classUid, studentData } = req.body;
    if (!(universityName && classUid && studentData && studentData.uid && studentData.email)) {
      res.status(400).send({message: 'Missing Fields'});
    } else {
      admin.database().ref(`universities/${universityName}/${classUid}`)
      .once('value')
      .then((snap) => {
        const classData = snap.val();
        if (classData) {
          if (classData.approvedEmails.indexOf(studentData.email) !== -1) {
            return addToStudentProfile(req.body);
          } else {
            res.status(400).send({message: 'Not pre-approved for this class.'});
          }
        } else {
          res.status(400).send({message: 'Class is no longer available'});
        }
      })
      .catch((err) => {
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});

exports.createclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      uid: user uid,
      universityName: 'College Name',
      classData: {
        name: 'CSC 59939 (L)',
        description: 'Topics in Software Engineering',
        instructor: firebase.auth().currentUser.uid,
        approvedEmails: ['1@email.com', '2@email.com'],
        meetingTimes: {
          from: '10:00',
          to: '13:00'
        }
      }
    }
  */
  function setTeacherProfile(query, classList) {
    const { uid, universityName, classData } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .set(classList)
    .then(()=>{
      res.status(200).send({message: `Created class ${classData.name}`});
    }).catch((err)=>{
      res.status(400).send({message: 'Something went wrong updating teacher profile.', error: err});
    });
  }

  function addToTeacherProfile(query, pushKey) {
    const { uid, universityName } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .once('value')
    .then((snap)=>{
      var existingClasses = snap.val();
      if (existingClasses) {
        existingClasses.push(pushKey);
      } else {
        existingClasses = [pushKey];
      }
      return setTeacherProfile(query, existingClasses);
    }).catch((err)=>{
      res.status(400).send({message: 'Something went wrong adding to teacher profile.', error: err});
    });
  }

  function createClass(query) {
    const { universityName, classData } = query;
    admin.database().ref(`universities/${universityName}`)
    .push(classData)
    .then((pushData)=>{
      return addToTeacherProfile(query, pushData.key);
    }).catch((err)=>{
      res.status(400).send({message: 'Something went wrong creating class.', error: err});
    });
  }

  return cors(req, res, () => {
    const { uid, universityName, classData } = req.body;
    if (!(uid && universityName && classData)) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`users/${uid}/type`)
      .once('value')
      .then((snap) => {
        const type = snap.val();
        if (type && (type === 'teacher')) {
          return createClass(req.body);
        } else if (type && (type === 'student')) {
          res.status(400).send({message: 'Not authorized to create class'});
        } else {
          res.status(400).send({message: 'Can\'t authorize user.'});
        }
      }).catch((err)=>{
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});

exports.requestclass = functions.https.onRequest((req, res) => {

  function updatePendingList(query, pendingList) {
    const { universityName, classUid } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .set(pendingList)
    .then(()=>{
      res.status(200).send({message: 'Requested permission.'});
    }).catch((err) => {
      res.status(400).send({message: 'Something went wrong updating to pending list.', error: err});
    });
  }

  function addToPendingList(query) {
    const { universityName, classUid, studentData } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .once('value')
    .then((snap) => {
      var pendingEmails = snap.val();
      if (pendingEmails) {
        pendingEmails.push(studentData.email);
      } else {
        pendingEmails = [studentData.email];
      }
      return updatePendingList(query, pendingEmails);
    }).catch((err) => {
      res.status(400).send({message: 'Something went wrong adding to pending list.', error: err});
    });
  }

  return cors(req, res, () => {
    const { universityName, classUid, studentData } = req.body;
    if (!(universityName && classUid && studentData && studentData.uid && studentData.email)) {
      res.status(400).send({message: 'Missing Fields'});
    } else {
      admin.database().ref(`universities/${universityName}/${classUid}`)
      .once('value')
      .then((snap) => {
        const classData = snap.val();
        if (classData) {
          if ( classData.approvedEmails && (classData.approvedEmails.indexOf(studentData.email) !== -1)) {
            res.status(400).send({message: 'Already approved for class, try joining instead.'});
          } else if ( classData.pendingEmails && (classData.pendingEmails.indexOf(studentData.email) !== -1)) {
            res.status(400).send({message: 'Already requested permission for this class.'});
          } else {
            return addToPendingList(req.body);
          }
        } else {
          res.status(400).send({message: 'Class is no longer available'});
        }
      })
      .catch((err) => {
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});
