exports.handler = function (req, res)  {

    /*
    {
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
}
