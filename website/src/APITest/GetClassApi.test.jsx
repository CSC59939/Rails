// get Class APi test
// check wifi for insturction for getting the data from API
const reqData = {
  universityName: 'CUNY City College',
  userEmail: 'student@email.com',
};
function getData() {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/getclasses', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
  }).then((result) => {
    return result.status;
  });
  return fetchData;
}

// regular jest test (matcher)
test('The getClass API should works', async () => { // requir async, since javascipt will not wait for api completed
  const data = await getData();
  // await mean to wait which process to be done, await only can be use in async function
  expect(data).toBe(200); // check th status
});
