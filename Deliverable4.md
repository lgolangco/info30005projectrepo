# Deliverable 4

## Functionalities
This deliverable focuses primarily on three main functionalities: venue, user and reviews. As a bonus, an admin functionality was included. 

## Sample login details
Email: test@test.com

Password: test1234


## Functionality 1: User
One of the main features within StudySpot is the ability for users to quickly and securely ***register and sign*** in to StudySpot. 
When the user first registers and account, their password is hashed using bCrypt and then saved into the user database. 
Aside from that, user authentication is implemented; for instance, if a non-authenticated user in attempts to log into the profile dashboard, they get redirected back to the login. 
If a non-admin user attempts to access the admin page, it redirects them to the home page. If the user tries to access an unknown page, it returns a 404 error page with a warning.

Within the user profile displays the user's details (name, email, bio, and avatar) as well as as well as the user’s bookmarks, reviews, and STUDYSPOT points. 
Users can edit their profile details, change or delete their avatars, delete their account, and remove bookmarked venues.

#### URLs:

The relevant URLs can be accessed through https://info30005-studyspot.herokuapp.com/

- /register - to register an individual into the database
- /login - for user to log into the profile dashboard
- /profile - authenticated user can access profile dashboard 

#### Relevant models:
- User
- Admin

#### Relevant controllers and routes:
- userController
- imageController
- adminController


- frontendRoutes.js (frontend)
- userRoute.js (backend)

#### Relevant views:

- login.pug
- register.pug
- profile.pug
     - usererror.pug
- userProfile.pug
- admin.pug
     - adminDeleteRequest.pug
     - adminDeleteSuggestion.pug
     - adminResolveSuggestion.pug
     - adminResolveRequest.pug
     - adminResolveSuggestion.pug
        
## Functionality 3: Venue

#### URLs:

#### Relevant models:

#### Relevant controllers and routes:

#### Relevant views:



## Functionality 4: Review

#### URLs:

#### Relevant models:

#### Relevant controllers and routes:

#### Relevant views: