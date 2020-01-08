# developer-profiler-generator
this Node app will generates a professional profile in .pdf format. The user is prompted to enter a Github user name and pick a color. It then generates a .pdf profile made from that Github users information.

The PDF will be populated with the following:

Profile image
User name
Links to the following:
User location via Google Maps
User GitHub profile
User blog
User bio
Number of public repositories
Number of followers
Number of GitHub stars
Number of users following

Unresolved issues/errors:
Repetitive error messages in node app:
(node:13828) UnhandledPromiseRejectionWarning: ReferenceError: htmlToPdf is not defined
    at readFileAsync.then.htmlString (C:\Users\katie\Documents\bootcamp\developer-profile-generator\index.js:87:34)
(node:13828) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch blockn without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:13828) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node
will terminate the Node.js process with a non-zero exit code.