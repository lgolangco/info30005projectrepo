# API documentation

For this deliverable, we've identified three key components:
1. User
2. Venue
3. Review

The functionalities associated with each component are outlined below.


## User
The user schema is as follows:
* \_id *(e.g. 5eac96af534733377b14d6ce)*
* email *(e.g. derekshephard@gmail.com)*
* firstName *(e.g. Derek)*
* lastName *(e.g. Shephard)*

The user component has the following functionalities:
1. **getAllUsers: GET /user/**  
This returns an array of all user objects.  
e.g. /user/  

2. **getUserByID: GET /user/:id/**  
This returns the user objects with the given \_id, if it exists in the database.  
e.g. /user/5eac96af534733377b14d6ce  

3. **getUserByEmail: GET /user/email/:email/**  
This returns the user objects with the given email, if it exists in the database.  
e.g. /user/email/derekshephard@gmail.com

4. **addUser: PUT /user/**  
This adds a user object with values set as per the request.  
e.g. /user/  

5. **updateUser: PATCH /user/:id/**  
This updates the user object with the given \_id as per the request, if it exists in the database.  
e.g. /user/5eac96af534733377b14d6ce  

6. **deleteUserByID: DELETE /user/:id/**  
This deletes the user object with the given \_id, if it exists in the database.
e.g. /user/5eac96af534733377b14d6ce  

## Venue
The venue schema is as follows:
* \_id *(e.g. 5ea39c005745fd4b5d77c8fe)*
* venueName *(e.g. Le Miel Et La Lune)*
* venueType *(e.g. Cafe)*
* venueStreetAddress *(e.g. 330 Cardigan St)*
* venueSuburb *(e.g. Carlton)*
* venueState *(e.g. VIC)*
* venuePostcode *(e.g. 3053)*

The venue component has the following functionalities:
1. **getAllVenues: GET /venue/**  
This returns an array of all venue objects.  
e.g. /venue/  

2. **getVenueByID: GET /venue/byid/:\_id/**  
This returns the venue object with the given \_id, if it exists in the database.  
If it does not exist in the database, it notifies the client.  

e.g. /venue/byid/5ea39c005745fd4b5d77c8fe  

3. **getVenueByPostcode: GET /venue/bypostcode/:venuePostcode**  
This returns an array of all the venue objects with the given postcode, if such venues exist in the database.  
If there are no venues in that postcode, it notifies the client.  

e.g. /venue/bypostcode/3053  

4. **getVenueByType: GET /venue/bytype/:venueType**  
This returns an array of all the venue objects with the given type, if such venues  exist in the database.  
If there are no venues with that type, it notifies the client.  

e.g. /venue/bytype/Cafe  

5. **addVenue: PUT /venue/**  
This adds a venue object with values set as per the request.  

e.g. /venue/  

6. **updateVenue: PATCH /venue/byid/:\_id**  
This updates the venue object with the given \_id as per the request, if it exists in the database.  
If it does not exist in the database, it notifies the client.  

e.g. /venue/byid/5ea39c005745fd4b5d77c8fe  

7. **deleteVenue: delete /venue/byid/:\_id**  
This deletes the venue object with the given \_id, if it exists in the database.  
If it does not exist in the database, it notifies the client.  

e.g. /venue/byid/5ea39c005745fd4b5d77c8fe  

## Review
The review schema is as follows:
* \_id *(e.g. 5ea95743b78d3762f88873c1)*
* venueId *(e.g. v1)*
* userId *(e.g. u1)*
* datePosted *(e.g. 2020-04-29T10:30:27.204+00:00)*
* content *(e.g. This is u2's first review for v1)*
* rating *(e.g. 2)*

The review component has the following functionalities:
1. **getAllReviews: GET /review/**  
This returns an array of all reviews.  
e.g. /review/5ea95743b78d3762f88873c1  

2. **updateReview: PATCH  /review/:venueId/**  
This returns the review object with the given \_id as per the request, if it exists in the database.  
e.g. /review/5ea95743b78d3762f88873c1  

3. **addReview: POST /review/**  
This adds a review object with values set as per the request.  
e.g. /review/  

4. **getReviewByIDs: GET /review/byids/:venueId/:userId/**   
This returns the review object with the given venue and user id values, if it exists in the database.  
e.g. /review/byids/v1/u1/

5. **getReviewByVenueID: GET /review/byvenue/:venueId/**  
This returns the review object with the given venue id value, if it exists in the database.  
e.g. /review/byvenue/v1/  

6. **getReviewByUserID: GET /review/byuser/:userId/**  ``
This returns the review object with the given user id value, if it exists in the database.  
e.g. /review/byuser/u1/  

7. **deleteReview: DELETE /review/:venueId/**
This deletes the venue object with the given \_id, if it exists in the database.  
e.g. /review/5ea95743b78d3762f88873c1/  
