const cron = require('node-cron'); 
const firebase = require('firebase-admin');
const fs = require('fs');
const log = require('simple-node-logger').createSimpleFileLogger('backup-logger.log');

const serviceAccount = require('./rails-private-key.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://rails-students.firebaseio.com"
});

cron.schedule('0 0-23 * * *', () => {
    const start = Date.now();
    log.info("Started backup...");
    firebase.database().ref('/')
    .once('value')
    .then((databaseSnap) => {
        const data = databaseSnap.val();
        if (data) {
            const dataJson = JSON.stringify(data);
            if (fs.existsSync('database.json')) {
                log.info("Older copy of database exists");
                fs.unlinkSync('database.json');
                log.info("Older copy of database deleted");
            }
            fs.writeFileSync('database.json', dataJson, 'utf8', (err) => {
                if (err) {
                    log.error("Failed to write to file\n" + JSON.stringify(err) + "\n");
                }
                else log.info("Wrote latest copy to 'database.json'");
            })
        } else {
            log.warn("Got garbage value from Firebase.");
        }
        const duration = Date.now() - start;
        log.info("Backup finished. Took " + duration + "ms\n============================================");
    })
    .catch((err) => {
        log.fatal("Databse fetch failed with exception\n" + JSON.stringify(err) + "\n");
        const duration = Date.now() - start;
        log.info("Backup finished. Took " + duration + "ms\n============================================");
    });
},{
    scheduled: true,
    timezone: "America/New_York"
});