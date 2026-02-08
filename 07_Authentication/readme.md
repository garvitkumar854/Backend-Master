Main 4 Steps

1. Validation
2. Verification
3. Authentication
4. Authorization

# Validation: (Checking the format of data)

mobile => 1234567890
email => 123456764 (that means validation)
fullName => John Doe
password => Test@123

# Verification: (Is Data is Correct or Not ?)

    Verify email, One time password, etc.;

# Authentication: (Identify the user from where the request is coming !)

# Authorization: (Granting Specific Permissions to Specific User)

    Student         1
    Faculty/Staff   2
    Principal:      3   (have all permissions)

Entire Authentication Functionality: {

## user registers to server,

    server stores the info, and then generate a token and sends it to the user.

## server allow user request only when user {logged in}, by sending the {copy of the token}

    User A ==> [Token A]
    User B ==> [Token B]
    User C ==> [Token C]

}


# Creating a Basic App to the Database connectivity
# Now for API we create a seperate folder = `routes` to create API's, (Note: require express again)

# The login of All API's will written in `Controllers` folder, `auth.controller.js`

# `jsonwebtoken` is used to generate the tokens for the users

# the `cookie-parser` middleware is used to store the tokens in cookies, use the middlware in `app.js`
# use `res.cookie` to store the token

# use `unique: true` for email and check the user if already registered or not !

# now create test routes to print and view the cookies and the token data

# now create a api for the /api/posts/create to create a post make sure user which have correct token can only create a post

# check if the token is present in cookie or not firstly
# verify the token using `jwt.verify(token)` throw error if if invalid token

# now we can use token: data which we intialized when creating the token to print that user that which is trying to create a post and log the data
# use `decoded` variable to store the token verified function object
