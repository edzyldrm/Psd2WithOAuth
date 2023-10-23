'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
  // Have to active acls and use source code from class to log in log out   
  //server.enableAuth()
};
