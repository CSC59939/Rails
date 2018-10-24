### General Notes

1. All responses from the API will have a `message` value - this should be shown as the notification if needed
2. Error Codes:  
   a. `500`- Authentication Error or Missing Data  
   b. `400` - Authentication Error or Database Fetch Error  
   c. `350` - Database Fetch Error  
   d. `300` - Database Write Error  
   e. `200` - Success

### How to handle response on client side

```jsx
fetch(<API_URL>, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: <REQUEST_DATA>,
    })
.then((res) => {
    if (res.status === 200) {
       // success case
    } else {
        // check for other codes if needed,
        // can otherwise just show the message
        message.info(res.message); // import { message } from 'antd';
    }
})
.catch((err) => {
    // Error sending request. Client side should handle
});
```

---

### Sign Up

**API:** https://us-central1-rails-students.cloudfunctions.net/signup  
**Expected Request:**

```
    input = {
      email: "1@email.com",
      name: "Full Name",
      password: "topsecret",
      universities: ["College Name", "College Name 2"],
      type: "student"
    }
```

_`universities` is not required  
_`type` must either be `"student"` or `"teacher"` - all lower case

---

### Get Class

**API:** https://us-central1-rails-students.cloudfunctions.net/getclass  
**Expected Request:**

```
    input = {
      universityName: 'College Name'
    }
```

**Expected Response:**

```
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
```

---

### Join Class

**API:** https://us-central1-rails-students.cloudfunctions.net/joinclass  
**Expected Request:**

```
    input = {
      universities: {
        'College Name': [' classUID' ]
      },
      token: getIdToken // https://firebase.google.com/docs/auth/admin/verify-id-tokens,
      uid: uid // use firebase.auth().currentUser.uid to get value
    }
```

---

### Create Class

**API:** https://us-central1-rails-students.cloudfunctions.net/createclass  
**Expected Request:**

```
    input = {
      token: getIdToken // use https://firebase.google.com/docs/auth/admin/verify-id-tokens,
      university: 'College Name',
      classData: {
        name: 'CSC 59939 (L)',
        instructor: uid // use firebase.auth().currentUser.uid,
        instructorName: 'Full Name' // use firebase.auth().currentUser.displayName,
        approvedEmails: ['1@email.com', '2@email.com']
      }
    }
```
