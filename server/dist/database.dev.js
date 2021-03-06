"use strict";

var properties = require('./json/properties.json');

var users = require('./json/users.json'); /// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


var getUserWithEmail = function getUserWithEmail(email) {
  var user;

  for (var userId in users) {
    user = users[userId];

    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }

  return Promise.resolve(user);
};

exports.getUserWithEmail = getUserWithEmail;
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

var getUserWithId = function getUserWithId(id) {
  return Promise.resolve(users[id]);
};

exports.getUserWithId = getUserWithId;
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

var addUser = function addUser(user) {
  var userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
};

exports.addUser = addUser; /// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

var getAllReservations = function getAllReservations(guest_id) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return getAllProperties(null, 2);
};

exports.getAllReservations = getAllReservations; /// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

var getAllProperties = function getAllProperties(options) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  // 1
  var queryParams = []; // 2

  var queryString = "\n  SELECT properties.*, avg(property_reviews.rating) as average_rating\n  FROM properties\n  JOIN property_reviews ON properties.id = property_id\n  "; // 3

  if (options.city) {
    queryParams.push("%".concat(options.city, "%"));
    queryString += "WHERE city LIKE $".concat(queryParams.length, " ");
  } // 4


  queryParams.push(limit);
  queryString += "\n  GROUP BY properties.id\n  ORDER BY cost_per_night\n  LIMIT $".concat(queryParams.length, ";\n  "); // 5

  console.log(queryString, queryParams); // 6

  return pool.query(queryString, queryParams).then(function (res) {
    return res.rows;
  });
};

exports.getAllProperties = getAllProperties;
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

var addProperty = function addProperty(property) {
  var propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

exports.addProperty = addProperty;