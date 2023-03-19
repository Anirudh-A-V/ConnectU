# ConnectU

This is a simple social media application. 

## Problem

Create a mini social network. The application should have features like:-
- Users should be able to sign up/sign in, and create a profile for themselves.
- Search for other users.
- View other users' profiles & make them friends/unfriend them.
- View a list of mutual friends between users. A mutual friend is a user who is a friend of two other users who may or may not know each other. 

## Solution
A social media application is a web app which requires a lot of interactivity and spontaneous ressponses from the server. The code for such a website should be optimized to ensure maximum performance. The tech stacks that I used are :

|Library/Framework|As|Reason|
|----------|------|---------|
|ReactJS|Frontend| Since ReactJS is best for building highly interactive web apps|
|Node.js|Backend| To optimize the code performance and have complete control of the backend logic which is not provided by a Backend-as-a-Service (BaaS) like Firebase|
|Express.js|API Framework| Easier development of API|
|MongoDB|Database| To add new features without changing the schema of the database a NoSQL Databse is used and it is also easy to scale the application|
|Firebase Storage|Storage Bucket| Cheap and Efficient Storage bucket, used for storing profile images|


## To Run the app

1. Leave a star ⭐ and Clone the repository
2. Open the repository and open the server folder
3. create a new file `.env` in it's root directory and copy from [backend.txt](https://gist.github.com/Anirudh-A-V/cdccadc28031c473838433cad79eff3c)
4. Now open a terminal session and type in the following 
````
npm i
npm run dev
````
5. This will start the server. Now goto the frontend directory of the repository.
6. Create a `.env` file and Copy the context from the [frontend.txt](https://gist.github.com/Anirudh-A-V/cdccadc28031c473838433cad79eff3c) and paste it.
7. Now open another terminal session and type in the following
````
npm i
npm run dev
````
8. Now goto [http://127.0.0.1:5173/](http://127.0.0.1:5173/) where the app will be initialised

## API details
The server is built using Node.js and Express, and uses JWT for authentication.
By default the server will be running in port 3000 which can be changed by simple changing the `PORT` value in the `.env` file.

### Authentication
All authenticated routes require a valid JWT token to be included in the Authorization header of the request.
````
Authorization: Bearer <Token>
````

### Routes
|Route|	HTTP Method|	Description|
|------|-----------|--------------|
|/	|GET	|Returns "Hello World!"|
|/users	|GET	|Returns a list of all users. Requires authentication.|
|/signup	|POST	|Creates a new user account.|
|/login	|POST	|Authenticates a user and returns a JWT token.|
|/logout	|POST	|Logs out the current user. Requires authentication.|
|/getUser/:id	|GET	|Returns information about the user with the specified ID. Requires authentication.|
|/send/:id	|POST	|Sends a friend request to the user with the specified ID. Requires authentication.|
|/accept	|POST	|Accepts a friend request. Requires authentication.|
|/unfriend/:id	|POST	|Unfriends the user with the specified ID. Requires authentication.|
|/mutual/:id	|POST	|Returns a list of mutual friends with the user with the specified ID. Requires authentication.|
|/friends	|POST	|Returns a list of all friends. Requires authentication.|
|/friendrequests	|POST	|Returns a list of all friend requests. Requires authentication.|
|/cancel/:id	|POST	|Cancels a friend request. Requires authentication.|
|/ignore/:id	|POST	|Ignores a friend request. Requires authentication.|
|/confirm/:id	|POST	|Checks if the specified user is a friend or if a friend request has been sent. Requires authentication.|

## Demo

https://user-images.githubusercontent.com/76550448/226198211-e23c1dda-b64c-4ab1-9dca-354cb5ea37a4.mp4

Link to the video file -> [Demo Video](https://drive.google.com/file/d/1AIo-E30WfwhC4IQHtnLRFMJJsW0dNHxQ/view?usp=sharing)

## Screenshots

![Screenshot 2023-03-19 234550](https://user-images.githubusercontent.com/76550448/226198415-9d0cca25-34e4-4ca3-9d32-24ebf3a5e4eb.png)
<hr></hr>

![Screenshot 2023-03-19 234633](https://user-images.githubusercontent.com/76550448/226198413-4a528165-8d56-439b-a673-129b963af0b5.png)
<hr></hr>

![Screenshot 2023-03-19 235711](https://user-images.githubusercontent.com/76550448/226198903-96124e1b-fae5-41c7-83de-3c646e2654c7.png)





