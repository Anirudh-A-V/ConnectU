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

