# Deliverable 4

## Functionalities
This deliverable focuses primarily on three main functionalities: venue, user and reviews. As a bonus, an admin functionality was included. 

## Sample login details
***Accessed as admin***

Email: test@test.com

Password: test1234


## Functionality 1: User
One of the main features is the ability for users to quickly and securely ***register and sign*** into STUDYSPOT. 
When the user first registers an account, their password is hashed using bCrypt and then saved into the user database. 
Aside from that, user authentication is implemented; for instance, if a non-authenticated user in attempts to log into the profile dashboard, they get redirected back to the login. 
If a non-admin user attempts to access the admin page, it redirects them to the home page. If the user tries to access an unknown page, it returns a 404 error page with a warning.

Within the user profile displays the user's details (name, email, bio, and avatar) as well as the user’s bookmarks, reviews, and STUDYSPOT points. 
Users can edit their profile details, change or delete their avatars, delete their accounts, and remove bookmarked venues.

#### URLs:

The relevant URLs can be accessed through https://info30005-studyspot.herokuapp.com/

- ***/register*** - to register an individual into the database
- ***/login*** - for user to log into the profile dashboard
- ***/profile*** - authenticated user can access profile dashboard 

#### Relevant models:
- user

#### Relevant controllers and routes:
- userController
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
STUDYSPOT venues are advertised on the website, each with their own venue profile page.
The ***venue profile*** page displays the venue details, its amenities as well as the aggregate ***star rating***, based on the reviews posted by different users.
Individuals can use the ***search*** tool to look through all registered venues or add filters to their search to find study spots that suit their needs.
With this functionality, users can narrow their search by specifying the venue type, venue suburb, noise levels, amenities provided (e.g. wifi, silent space, etc.), or simply searching for the name of the venue.


#### URLs:

The relevant URLs can be accessed through https://info30005-studyspot.herokuapp.com/
- ***/venue*** - displays list of venues and the filters for amenities 

#### Relevant models:
- venue
- venueRequests
- venuesuggestions

#### Relevant controllers and routes:
- venueController

#### Relevant views:
- venues.pug
    - venueRequestNew.pug
- venueProfile.pug
    - venueSuggestions.pug
    - venueUpdateForm.pug
    - venueDelete.pug
    - venueGallery.pug


## Functionality 4: Review
Users can leave a review for a venue through the venue’s profile page. 
The ***reviews*** were designed in such a way that users can only have one review per venue.
This ensures that each user could have their most up-to-date experience on the website and that the aggregate ***ratings*** for each venue only consider a user’s rating once.
From their profile page, users can view a list of all the reviews they have left for different venues, as well as their ***SS points***.
Users can earn more STUDYSPOT points by reviewing more venues, which encourages users to be more active on the website.

#### URLs:
The relevant URLs can be accessed through https://info30005-studyspot.herokuapp.com/


#### Relevant models:
- review

#### Relevant controllers and routes:
- reviewController

#### Relevant views:
- deleteReview.pug
- reviewUpdate.pug
