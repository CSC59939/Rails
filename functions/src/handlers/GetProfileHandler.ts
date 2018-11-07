import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function getprofile (req, res) {
    /*
    =======
    REQUEST
    =======
    {
        "uid": "users=uid=alkdfja",
        "idToken": "lakfsjlkafjsdlakfjsd" -- https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
    }
    ========
    RESPONSE
    ========
    {
        "message" : "User profile found",
        "userData" : {
            "displayName": "Full Name",
            "email": "fullname@email.com",
            "type": "student", -- student or teacher
            "universities": {
                "CUNY City College" : {
                    "classUid1" : {
                        "name": "CSC 59939 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,  -- 0 = low, 1 = normal, 2 = high
                            }
                        }
                    }
                }
            }
        }
    }
    */

    async function getClassEventsHelper(classUid) {
        const eventsData = await admin.database().ref(`events/${classUid}`).once('value')
        .then((snap) => {
            const eventsSnap = snap.val();
            if (eventsSnap) {
                const tempEventsData = {};
                Object.keys(eventsSnap).forEach((key) => {
                    const { title, description, priority, postedDate, dueDate } = eventsSnap[key];
                    tempEventsData[key] = { title, description, priority, postedDate, dueDate };
                });
                return tempEventsData;
            } else {
                return {};
            }
        }).catch((err) => {
            res.status(400).send({message: 'Something went wrong', error: err});
        });
        return eventsData;
    }

    async function getClassDetailsHelper(universityName, classUid) {
        const classData : any = await admin.database().ref(`universities/${universityName}/${classUid}`).once('value')
        .then((snap) => {
            const classSnap = snap.val();
            if (classSnap) {
                const { name, description, instructorName, meetingDays, meetingTimes } = classSnap;
                return { name, description, instructorName, meetingDays, meetingTimes };
            } else {
                return res.status(400).send({message: 'Failed to get class details'});
            }
        }).catch((err) => {
            res.status(400).send({message: 'Something went wrong', error: err});
        });
        classData['events'] = getClassEventsHelper(classUid);
        return classData;
    }

    function getClassDetails(userData, classList) {
        const universities = {};
        Object.keys(classList).forEach((key) => {
            const universityData = {};
            classList[key].forEach((classUid) => {
                universityData[classUid] = getClassDetailsHelper(key, classUid);
            });
            universities[key] = universityData;
        });
        userData['universities'] = universities;
        return res.status(200).send({message: 'Got user profile.', userData: userData});
    }

    function getUserFromDatabase(query, userData) {
        const { uid } = query;
        admin.database().ref(`users/${uid}`)
        .once('value')
        .then((snap) => {
            const userSnapData = snap.val();
            if (userSnapData) {
                userData['type'] = userSnapData.type;
                if (userSnapData.universities) {
                    return getClassDetails(userData, userSnapData.universities);
                } else {
                    userData['universities'] = {};
                    return res.status(200).send({message: 'Got user profile.', userData: userData});
                }
            } else {
                return res.status(400).send({message: 'User type not found.'});
            }
        }).catch((err) => {
            res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function getUserData(query) {
        const { uid } = query;
        admin.auth().getUser(uid)
        .then((user)=>{
            const { displayName, email } = user;
            const userData = { displayName, email };
            return getUserFromDatabase(query, userData);
        }).catch((err) => {
            res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, () => {
        const { idToken, uid, testingUid } = req.body;
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            if (testingUid === uid ) {
            // if (decodedToken.uid === uid) {
                return getUserData(req.body);
            } else {
                return res.status(400).send({message: 'User authorization error'});
            }
        }).catch((err) => {
            res.status(400).send({message: 'Something went wrong', error: err});
        });
    });
}
