const bcrypt = require('bcrypt')
const saltRounds = 10

const saltedPassword = function(plainTextPassword, saltRounds) {
  bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
}

const isValidPassword = function(user, password) {
  const saltedPassword = user.password
  return bcrypt.compare(password, saltedPassword).then(function(res) {
    return res
  })
}

const find = function(username) {
  return new Promise((resolve, reject) => {
    resolve(users[username])
  })
}

const create = function(user) {
  // return saltedPassword(username, password, saltRounds).then(() => {console.log('created the password for the user')})

  return db.one(`
    INSERT INTO users
      (username, password, role)
    VALUES
      ($1::text, $2::text, $3)
    RETURNING *`,
    [
      user.username,
      user.password,
      user.role
    ])
    .catch(error => error)
}

const getUsers = function(user) {
  return db.query(`
    SELECT
      *
    FROM
      users
      `)
    .catch(error => error)
}

const getUser = function(username) {
  return db.one(`
    SELECT
      *
    FROM
      users
    WHERE
      username=$1::text
      `,
    [
      username
    ])
    .catch(error => error)
}

const deleteUser = function(username) {
  return db.query(`
    DELETE
    FROM
      users
    WHERE
      id=$1::text
      `,
    [
      username
    ])
    .catch(error => error)
}

module.exports = {
  isValidPassword,
  find,
  create,
  getUser,
  getUsers,
  deleteUser
}
