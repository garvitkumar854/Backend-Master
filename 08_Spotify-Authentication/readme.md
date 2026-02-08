# Creating a Spotify Clone (Concept = Authentication, Authorization, Middlewares)

# Two Types of User

1. Normal User (Listen Music's)
2. Artist (Can Create Music)

# create database and model for users

# create register api for user and create a user, (perform neccessary steps also: token, cookie, user checking)

# for passwords we do hashing, by using `bcryptjs` package

# hash the password and store the hash in db

# run the server and check

# function = login using (email, password) AND (username, password) both

# login the user:

1. check the user is present or not using email or username
2. check if the password is valid
3. generate token if all correct
4. store the token in cookie
5. exports the both register and loginuser functions

# create a seperate music route to define the login of sepearate roles

# create music model by defining image, title, and artist = (id fetched by userModel)
# create create music function by perfoming the verification code
# make the musicModel api protected