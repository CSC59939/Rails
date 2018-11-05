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
      return res.status(200).send({message: 'Signed up successfully'});
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
        } else {
          return res.status(400).send({message: 'User created, but couldn\'t be fetched.'});
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
          return res.status(200).send({message: 'Classes found.', classList: processedData});
        } else {
          return res.status(300).send({message: `No classes found for ${universityName}`});
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
      return res.status(200).send({message: 'Successfully joined class.'});
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
            return res.status(400).send({message: 'Not pre-approved for this class.'});
          }
        } else {
          return res.status(400).send({message: 'Class is no longer available'});
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
{
  "uid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
  "universityName": "CUNY City College",
  "classData": {
    "name": "CSC 59939 (L)",
    "description": "Topics in Software Engineering",
    "instructorUid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
    "instructorName": "Full Test Name",
    "approvedEmails": ["1@email.com", "2@email.com"],
    "meetingTimes": {
      "from": "18:30",
      "to": "21:00"
    },
    "meetingDays" : {
        "Monday": "false",
        "Tuesday": "false",
        "Wednesday": "true",
        "Thursday": "false",
        "Friday": "false",
        "Saturday": "false",
        "Sunday": "false"
    }
  }
}
  */
  function setTeacherProfile(query, classList) {
    const { uid, universityName, classData } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .set(classList)
    .then(()=>{
      return res.status(200).send({message: `Created class ${classData.name}`});
    }).catch((err)=>{
      return res.status(400).send({message: 'Something went wrong updating teacher profile.', error: err});
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
    if (!(uid && universityName && classData && classData.name && classData.description && classData.instructorName && classData.instructorUid && classData.meetingTimes && classData.meetingDays)) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`users/${uid}/type`)
      .once('value')
      .then((snap) => {
        const type = snap.val();
        if (type && (type === 'teacher')) {
          return createClass(req.body);
        } else if (type && (type === 'student')) {
          return res.status(400).send({message: 'Not authorized to create class'});
        } else {
          return res.status(400).send({message: 'Can\'t authorize user.'});
        }
      }).catch((err)=>{
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});

exports.requestclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      universityName: 'CUNY City College',
      classUid: 'someclass-uid',
      studentEmail: 'student@email.com'
    }
  */
  function updatePendingList(query, pendingList) {
    const { universityName, classUid } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .set(pendingList)
    .then(()=>{
      return res.status(200).send({message: 'Requested permission.'});
    }).catch((err) => {
      res.status(400).send({message: 'Something went wrong updating to pending list.', error: err});
    });
  }

  function addToPendingList(query) {
    const { universityName, classUid, studentEmail } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .once('value')
    .then((snap) => {
      var pendingEmails = snap.val();
      if (pendingEmails) {
        pendingEmails.push(studentEmail);
      } else {
        pendingEmails = [studentEmail];
      }
      return updatePendingList(query, pendingEmails);
    }).catch((err) => {
      res.status(400).send({message: 'Something went wrong adding to pending list.', error: err});
    });
  }

  return cors(req, res, () => {
    const { universityName, classUid, studentEmail } = req.body;
    if (!(universityName && classUid && studentEmail )) {
      res.status(400).send({message: 'Missing Fields'});
    } else {
      admin.database().ref(`universities/${universityName}/${classUid}`)
      .once('value')
      .then((snap) => {
        const classData = snap.val();
        if (classData) {
          if ( classData.approvedEmails && (classData.approvedEmails.indexOf(studentEmail) !== -1)) {
            return res.status(400).send({message: 'Already approved for class, try joining instead.'});
          } else if ( classData.pendingEmails && (classData.pendingEmails.indexOf(studentEmail) !== -1)) {
            return res.status(400).send({message: 'Already requested permission for this class.'});
          } else {
            return addToPendingList(req.body);
          }
        } else {
          return res.status(400).send({message: 'Class is no longer available'});
        }
      })
      .catch((err) => {
        res.status(400).send({message: 'Something went wrong.', error: err});
      });
    }
  });
});

exports.approveclass = functions.https.onRequest((req, res) => {
  /*
    input = {
      universityName: 'CUNY City College',
      classUid: 'someclass-uid',
      studentEmail: 'student@email.com',
      uid: 'instructor=uid'
    }
  */
  function updateStudentProfile(query, uid, classList) {
    const { universityName } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .set(classList)
    .then(() => {
      return res.status(200).send({message: 'Approved and added student to class.'})
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function addToStudentProfile(query, uid) {
    const { universityName, classUid } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .once('value')
    .then((snap) => {
      var classList = snap.val();
      if (classList) {
        classList.push(classUid);
      } else {
        classList = [classUid];
      }
      return updateStudentProfile(query, uid, classList);
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function getStudentProfile(query) {
    const { studentEmail } = query;
    admin.auth().getUserByEmail(studentEmail)
    .then((user) => {
      if (user) {
        return addToStudentProfile(query, user.uid);
      } else {
        return res.status(400).send({message: 'Student account not found.'});
      }
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function updateApprovedList(query, emailList) {
    const { universityName, classUid } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/approvedEmails`)
    .set(emailList)
    .then(()=>{
      return getStudentProfile(query);
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function addToApprovedList(query) {
    const { universityName, classUid, studentEmail } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/approvedEmails`)
    .once('value')
    .then((snap)=>{
      var approvedEmails = snap.val();
      if (approvedEmails) {
        approvedEmails.push(studentEmail);
      } else {
        approvedEmails = [studentEmail];
      }
      return updateApprovedList(query, approvedEmails);
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function updatePendingList(query, emailList) {
    const { universityName, classUid } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .set(emailList)
    .then(()=>{
      return addToApprovedList(query);
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  function addToPendingList(query) {
    const { universityName, classUid, studentEmail } = query;
    admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
    .once('value')
    .then((snap) => {
      var pendingEmails = snap.val();
      if (pendingEmails) {
        const emailIndex = pendingEmails.indexOf(studentEmail);
        if ( emailIndex !== -1) {
          pendingEmails.splice(emailIndex, 1);
          return updatePendingList(req.body, pendingEmails);
        } else {
          return res.status(400).send({message: 'Student email not found.'});
        }
      } else {
        return res.status(400).send({message: 'Couldn\'t get class details.'});
      }
    })
    .catch((err) => {
      return res.status(400).send({message: 'Something went wrong', error: err});
    });
  }

  return cors(req, res, () => {
    const { universityName, classUid, studentEmail, uid } = req.body;
    if (!(universityName && classUid && studentEmail && uid)) {
      return res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`users/${uid}/type`)
      .once('value')
      .then((snap) => {
        const userType = snap.val();
        if (userType) {
          if (userType === 'teacher') {
            return addToPendingList(req.body);
          } else {
            return res.status(400).send({message: 'User can\'t approve emails (not teacher).'})
          }
        } else {
          return res.status(400).send({message: 'User not found - UID may be wrong.'});
        }
      })
      .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
      });
    }    
  });
});