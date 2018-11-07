const cors = require('cors')({origin: true});
const admin = require('firebase-admin');

exports.handler =  function (req, res) {
    /*
    {
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
}
