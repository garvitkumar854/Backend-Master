# Project -> store post and its caption using a database and API's and Imagekit (cloud storage provider)

1. same process till the database connectivity
2. data is in form format in post api
3. multer middleware is using for handle files, and form data of res.body

- `const upload = multer({storage: multer.memoryStorage()});`

4. in post api add `upload.single("image")` image = same name of file key in form data

- still image file not received but other will received

5. use `console.log(req.file)` which provides the file and buffer in which actual files stored
6. different folder of services for the `imagekit` related code.

7. using .env file for storing the secret credentials and `dotenv` package to work with env

8. now make a uploadFile function in post.model.js which upload the file exports it
9. in app.js create a post api, to upload the file, and update the database
10. create get api to get all posts data from the db

-- FRONTEND

1. create a vite app: npm create vite@latest

- React, Javascript

2. install `react-router-dom` package to create routes
3. remove default styling from App.css, App.jsx, index.css
4. create routes in `App.jsx`
5. create pages folder, for createpost and feed routes, and pages
6. write the ui code in the pages jsx's and style them in `index.css`
7. render the pages in `App.jsx` using the routes
8. map the posts in feed.jsx to show the sample posts
9. install the `axios` package to call api in react
10. import `axios` in feed.jsx
11. import useeffect in feed.jsx to prevent the continuously calling of API
12. CORS policy error to restrict different origin requests (5173 ---> 3000 port) {frontend -> backend}
13. install `cors` to backend server, restart the server
14. require `cors` in `app.js` and use first middleware of `cors`, problem solved
15. now in createpost use the axios to call the post api, handle form submit

16. use `useNavigate` to navigate the user from create post to feed page and vice-versa
