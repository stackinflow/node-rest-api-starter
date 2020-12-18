const Auth = require("../../api/v1/models/auth");
const Token = require("../../api/v1/models/token");
const User = require("../../api/v1/models/user");
const SuccessMessages = require("../../api/v1/utils/constants").successMessages;
const Headers = require("../../api/v1/utils/constants").headers;
const Errors = require("../../api/v1/utils/constants").errors;

var name = "Mohammad Fayaz";

var data = {
  email: "fayaz5@test.com",
  password: "Pass!w0rd",
};

var tampered_data = {
  email: "fayaz6@test.com",
  password: "Pass!w0rd",
};

var adminCredentials = {
  email: "fayaz@admin.com",
  password: "P4ss!$word76",
};

const baseUrl = "/api/v1/auth";
const baseUrlUser = "/api/v1/user";
const baseUrlAdmin = "/api/v1/admin/auth";
var verificationToken;
var accessToken, refreshToken;

var accessTokenAdmin, refreshTokenAdmin;

module.exports = (chai, server) => {
  // because they come with mocha in command line
  /*global before, describe,it*/
  /*eslint no-undef: "error"*/
  /*eslint no-unused-vars: "error"*/

  before(function () {
    this.timeout(5000);
    /* eslint-disable */
    return new Promise((resolve, reject) => {
      Auth.deleteMany().then((data) => {
        Token.deleteMany().then((data) => {
          User.deleteMany().then((data) => {
            return resolve();
          });
        });
      });
    });
  });

  /* eslint-enable */
  describe("Testing Auth API", () => {
    it("should not login as user is not existing", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .set("Content-Type", "application/json")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          response.should.not.have.header(Headers.ACCESS_TOKEN);
          response.should.not.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should not register the user as name is not specified", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          email: data.email,
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not register the user as email is not specified", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not register the user as password is not specified", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          email: data.email,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not register as email is invalid", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          email: "data.email",
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not register as password is weak", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          email: data.email,
          password: "data1",
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should register the user", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          email: data.email,
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(201);
          done();
        });
    });

    it("should create a document in User collection", (done) => {
      User.find().then((array) => {
        console.log(`Users length: ${array.length}`);
        array.length.should.equal(1);
        array[0].email.should.equal(data.email);
        done();
      });
    });

    it("should not register duplicate users", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/register")
        .send({
          name: name,
          email: data.email,
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(409);
          done();
        });
    });

    it("should store the verification token in db ", (done) => {
      // fetching the very first token in tokens collection,
      // because we won't have access to the userId generated by
      // mongodb by default and Tokens collection is empty before this
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        verificationToken = array[0].token;
        done();
      });
    });

    it("should not resend new account verification token as user is not existing ", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/token/resend")
        .send(tampered_data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    it("should create new verification token in db and send email ", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/token/resend")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("old verification should not match new token ", (done) => {
      // fetching the very first token in tokens collection,
      // because we won't have access to the userId generated by
      // mongodb by default and Tokens collection is empty before this
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        array[0].token.should.not.equal(verificationToken);
        verificationToken = array[0].token;
        done();
      });
    });

    it("should not allow user to login as email is not verified", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .set("Content-Type", "application/json")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          response.should.not.have.header(Headers.ACCESS_TOKEN);
          response.should.not.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should not verify the user as no token is passed", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token/verify?t=")
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not verify the user as token is tampered", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token/verify?t=TAMPERED" + verificationToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should verify the user ", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token/verify?t=" + verificationToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("token should be deleted after verifying", (done) => {
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        array.should.have.length(0);
        done();
      });
    });

    it("should not verify the user multiple times ", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token/verify?t=" + verificationToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should not allow user to login as tried to login as admin", (done) => {
      chai
        .request(server)
        .post("/api/v1/admin/auth/login")
        .set("Content-Type", "application/json")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          response.should.not.have.header(Headers.ACCESS_TOKEN);
          response.should.not.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should log the user in and send tokens to the user ", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.have.header(Headers.ACCESS_TOKEN);
          response.should.have.header(Headers.REFRESH_TOKEN);
          accessToken = response.header[Headers.ACCESS_TOKEN];
          refreshToken = response.header[Headers.REFRESH_TOKEN];
          done();
        });
    });

    it("should reject password change as passwords are same ", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: data.password, newPassword: data.password })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should reject password change as password is incorrect ", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: "Passwd@007", newPassword: data.password + "asd" })
        .end((err, response) => {
          console.log(response.body);
          response.body.message.should.equal(Errors.INCORRECT_PASSWORD);
          response.should.have.status(400);
          done();
        });
    });

    it("should reject password change as new password is weak ", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: data, newPassword: "Asd1adfad" })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should reject password change as token is not passed ", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        // .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: data.password, newPassword: data + "a" })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should reject password change as BASIC type in auth header", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BASIC + " " + accessToken)
        .send({ oldPassword: data.password, newPassword: data.password + "a" })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(403);
          done();
        });
    });

    it("should reject change password as both passwords are same", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: data.password, newPassword: data.password })
        .end((err, response) => {
          console.log(response.body);
          response.body.message.should.equal(Errors.OLD_PASSWORD_IS_SAME);
          response.should.have.status(400);
          done();
        });
    });

    it("should change password", (done) => {
      chai
        .request(server)
        .patch(baseUrl + "/password")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ oldPassword: data.password, newPassword: data.password + "a" })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should not login with old password", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .set("Content-Type", "application/json")
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          response.should.not.have.header(Headers.ACCESS_TOKEN);
          response.should.not.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should login with new password", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .set("Content-Type", "application/json")
        .send({ email: data.email, password: data.password + "a" })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.have.header(Headers.ACCESS_TOKEN);
          response.should.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should send otp to email and store the otp in server", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/password/reset/code")
        .set("Content-Type", "application/json")
        .send({ email: data.email })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("otp should exist in db", (done) => {
      // old token will be deleted after verifying
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        array[0].token.should.not.equal(verificationToken);
        verificationToken = array[0].token;
        done();
      });
    });

    it("should resend otp to email and overriding the old otp in server", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/password/reset/code/resend")
        .set("Content-Type", "application/json")
        .send({ email: data.email })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("old otp should not be equal to new otp that exists in db", (done) => {
      // old token will be deleted after verifying
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        array[0].token.should.not.equal(verificationToken);
        verificationToken = array[0].token;
        done();
      });
    });

    it("should reset the password and delete otp in server", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/password/reset")
        .set("Content-Type", "application/json")
        .send({
          email: data.email,
          otp: verificationToken,
          password: data.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("otp should be deleted after resetting password", (done) => {
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        array.should.have.length(0);
        done();
      });
    });

    it("should login with new password after resetting and should have tokens", (done) => {
      chai
        .request(server)
        .post(baseUrl + "/login")
        .set("Content-Type", "application/json")
        // as in previous step, we have resetted the password to old one
        .send(data)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.have.header(Headers.ACCESS_TOKEN);
          response.should.have.header(Headers.REFRESH_TOKEN);

          accessToken = response.header[Headers.ACCESS_TOKEN];
          refreshToken = response.header[Headers.REFRESH_TOKEN];
          done();
        });
    });

    it("should not give new access token as type is Bearer", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token")
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + refreshToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(403);
          response.should.not.have.header(Headers.ACCESS_TOKEN);
          response.should.not.have.header(Headers.REFRESH_TOKEN);
          done();
        });
    });

    it("should give new access token and new tokens should not be equal to the old ones", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token")
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BASIC + " " + refreshToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.have.header(Headers.ACCESS_TOKEN);
          response.should.have.header(Headers.REFRESH_TOKEN);

          accessToken = response.header[Headers.ACCESS_TOKEN];
          done();
        });
    });

    // ***************** User routes testing start ******************//
    var username;
    it("should fetch user data", (done) => {
      chai
        .request(server)
        .get(baseUrlUser)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.body.user.should.not.equal(null);
          username = response.body.user.username;
          response.should.have.status(200);
          done();
        });
    });

    it("should return username is taken", (done) => {
      chai
        .request(server)
        .get(baseUrlUser + "/check/" + username)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.body.message.should.equal(Errors.USERNAME_IN_USE);
          response.should.have.status(409);
          done();
        });
    });

    it("should return username is available", (done) => {
      chai
        .request(server)
        .get(baseUrlUser + "/check/" + "fayaz")
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.body.message.should.equal(
            SuccessMessages.USERNAME_AVAILABLE
          );
          response.should.have.status(200);
          done();
        });
    });

    it("should update username", (done) => {
      chai
        .request(server)
        .patch(baseUrlUser)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .send({ username: "fayaz" })
        .end((err, response) => {
          console.log(response.body);
          response.body.user.username.should.equal("fayaz");
          response.should.have.status(200);
          done();
        });
    });

    it("should give user details", (done) => {
      chai
        .request(server)
        .get(baseUrlUser)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    // ***************** User routes testing end ******************//

    // ***************** Admin routes testing start ******************//

    it("should not login admin as admin doesn't exists", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/login")
        .set("Content-Type", "application/json")
        .send(adminCredentials)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should register admin", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/register")
        .set("Content-Type", "application/json")
        .send({
          name: name,
          email: adminCredentials.email,
          password: adminCredentials.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(201);
          done();
        });
    });

    it("should not login admin as admin didn't verify email", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/login")
        .set("Content-Type", "application/json")
        .send({
          email: adminCredentials.email,
          password: adminCredentials.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    it("should store the verification token for admin in db ", (done) => {
      // fetching the very first token in tokens collection,
      // because we won't have access to the userId generated by
      // mongodb by default and Tokens collection is empty before this
      Token.find().then((array) => {
        console.log(`Token collection length: ${array.length}`);
        verificationToken = array[0].token;
        done();
      });
    });

    it("should verify the admin ", (done) => {
      chai
        .request(server)
        .get(baseUrl + "/token/verify?t=" + verificationToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should not login admin as admin account approval is set on pending", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/login")
        .set("Content-Type", "application/json")
        .send({
          email: adminCredentials.email,
          password: adminCredentials.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    it("[MANUAL-COMMAND] should reject the user", (done) => {
      Auth.updateOne(
        { email: adminCredentials.email },
        { $set: { status: "rejected" } }
      ).then((user) => {
        console.log(`After rejecting admin:`);
        console.log(user);
        done();
      });
    });

    it("should not login admin as admin account approval is rejected", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/login")
        .set("Content-Type", "application/json")
        .send({
          email: adminCredentials.email,
          password: adminCredentials.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    it("[MANUAL-COMMAND] should approve the user", (done) => {
      Auth.updateOne(
        { email: adminCredentials.email },
        { $set: { status: "approved" } }
      ).then((user) => {
        console.log(`After approving admin:`);
        console.log(user);
        done();
      });
    });

    it("should login admin as admin account approved", (done) => {
      chai
        .request(server)
        .post(baseUrlAdmin + "/login")
        .set("Content-Type", "application/json")
        .send({
          email: adminCredentials.email,
          password: adminCredentials.password,
        })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.should.have.header(Headers.ACCESS_TOKEN);
          response.should.have.header(Headers.REFRESH_TOKEN);
          accessTokenAdmin = response.header[Headers.ACCESS_TOKEN];
          refreshTokenAdmin = response.header[Headers.REFRESH_TOKEN];
          done();
        });
    });

    it("should not fetch users as normal user tried to use admin's access token", (done) => {
      chai
        .request(server)
        .get(baseUrlAdmin + "/users")
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    var userId;
    it("should fetch users", (done) => {
      chai
        .request(server)
        .get(baseUrlAdmin + "/users")
        .set("Content-Type", "application/json")
        .set(
          Headers.AUTHORIZATION_HEADER,
          Headers.BEARER + " " + accessTokenAdmin
        )
        .end((err, response) => {
          console.log(response.body);

          response.should.have.status(200);
          response.body.data.users.length.should.not.equal(0);
          userId = response.body.data.users[0]._id;
          done();
        });
    });

    it("should disable user access", (done) => {
      chai
        .request(server)
        .patch(baseUrlAdmin + "/user/disable")
        .set("Content-Type", "application/json")
        .set(
          Headers.AUTHORIZATION_HEADER,
          Headers.BEARER + " " + accessTokenAdmin
        )
        .send({ userId: userId })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should not give user details as user access is revoked", (done) => {
      chai
        .request(server)
        .get(baseUrlUser)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(401);
          done();
        });
    });

    it("should disable user access", (done) => {
      chai
        .request(server)
        .patch(baseUrlAdmin + "/user/enable")
        .set("Content-Type", "application/json")
        .set(
          Headers.AUTHORIZATION_HEADER,
          Headers.BEARER + " " + accessTokenAdmin
        )
        .send({ userId: userId })
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should give user details as user access is approved again", (done) => {
      chai
        .request(server)
        .get(baseUrlUser)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should delete the admin account", (done) => {
      chai
        .request(server)
        .delete(baseUrl)
        .set("Content-Type", "application/json")
        .set(
          Headers.AUTHORIZATION_HEADER,
          Headers.BEARER + " " + accessTokenAdmin
        )
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    // ***************** Admin routes testing end ******************//

    it("should not delete the user account as token is tampered", (done) => {
      chai
        .request(server)
        .delete(baseUrl)
        .set("Content-Type", "application/json")
        .set(
          Headers.AUTHORIZATION_HEADER,
          Headers.BEARER + " TAMPER" + accessToken
        )
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(400);
          done();
        });
    });

    it("should delete the user account", (done) => {
      chai
        .request(server)
        .delete(baseUrl)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(200);
          done();
        });
    });

    it("should not delete the user account as it's already deleted", (done) => {
      chai
        .request(server)
        .delete(baseUrl)
        .set("Content-Type", "application/json")
        .set(Headers.AUTHORIZATION_HEADER, Headers.BEARER + " " + accessToken)
        .end((err, response) => {
          console.log(response.body);
          response.should.have.status(403);
          done();
        });
    });

    it("no users should exist in auth collection after deleting", (done) => {
      Auth.find().then((users) => {
        console.log(`Auth collection length: ${users.length}`);
        users.should.have.length(0);
        done();
      });
    });

    it("no users should exist in user collection after deleting", (done) => {
      User.find().then((users) => {
        console.log(`Users collection length: ${users.length}`);
        users.should.have.length(0);
        done();
      });
    });
  });

  return accessToken;
};
