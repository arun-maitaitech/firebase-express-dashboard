// import * as FirebaseAdmin from 'firebase-admin';

const FirebaseAdmin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

// console.log(process.env);
const fb_secrets = JSON.parse(process.env.FB_SECRETS);
const serviceAccount = JSON.parse(process.env.FB_SECRETS);

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
  databaseURL: fb_secrets.databaseURL,
});

(async () => {
  const usersListResult = await FirebaseAdmin.auth().listUsers();
  for (const userIndex in usersListResult.users) {
    const user = usersListResult.users[userIndex];
    if (user.customClaims && user.customClaims?.orgRoles && (user.customClaims?.orgRoles?.[0]?.role !== 'owner')){
      const updatedClaims = {...user.customClaims};
      delete updatedClaims.orgRoles;
      await FirebaseAdmin.auth().setCustomUserClaims(user.uid, updatedClaims);
      console.log('Claims updated of user:', user.email);
    }
  }
})();

// FirebaseAdmin.auth()
//   .listUsers()
//   .then(result => {
//     console.log('result', result);
//     result.users.forEach((userItem, index) => {
//       fs.writeFile(
//         `./customClaimsByUserId/${userItem.uid}.txt`,
//         userItem.customClaims ? JSON.stringify(userItem.customClaims) : '',
//         function (err) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('The file was saved!', index + 1, userItem.uid);
//         }
//       );
//     });

//     // fs.writeFile('', 'Hey there!', function (err) {
//     //   if (err) {
//     //     return console.log(err);
//     //   }
//     //   console.log('The file was saved!');
//     // });
//   });
