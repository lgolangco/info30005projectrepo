# API documentation

For this deliverable, we've identified three key components:
1. User
2. Venue
3. Review

The functionalities associated with each component are outlined below.


## User
The user schema is as follows:
* \_id (e.g. 5eac96af534733377b14d6ce)
* email (e.g. derekshephard@gmail.com)
* firstName (e.g. Derek)
* lastName (e.g. Shephard)

The user component has the following functionalities:


## Venue
The venue schema is as follows:
* \_id (e.g. 5ea39c005745fd4b5d77c8fe)
* venueName (e.g. Le Miel Et La Lune)
* venueType (e.g. Cafe)
* venueStreetAddress (e.g. 330 Cardigan St)
* venueSuburb (e.g. Carlton )
* venueState (e.g. VIC)
* venuePostcode (e.g. 3053)

The venue component has the following functionalities:
1. *getAllVenues: GET /venue/*
e.g. /venue/
This returns an array of all venue objects.

2. *getVenueByID: GET /venue/byid/:\_id/*
e.g. /venue/byid/5ea39c005745fd4b5d77c8fe
This returns the venue object with the given \_id, if it exists in the database.
If it does not exist in the database, it notifies the client.

3. *getVenueByPostcode: GET /venue/bypostcode/:venuePostcode*
e.g. /venue/bypostcode/3053
This returns an array of all the venue objects with the given postcode, if such venues exist in the database.
If there are no venues in that postcode, it notifies the client.

4. *getVenueByType: GET /venue/bytype/:venueType*
e.g. /venue/bytype/Cafe
This returns an array of all the venue objects with the given type, if such venues  exist in the database.
If there are no venues with that type, it notifies the client.

5. *addVenue: PUT /venue/*
e.g. /venue/
This adds a venue object.

6. *updateVenue: PATCH /venue/byid/:\_id*
e.g. /venue/byid/5ea39c005745fd4b5d77c8fe
This updates the venue object with the given \_id, if it exists in the database.
If it does not exist in the database, it notifies the client.

7. *deleteVenue: delete /venue/byid/:\_id*
e.g. /venue/byid/5ea39c005745fd4b5d77c8fe
This deletes the venue object with the given \_id, if it exists in the database.
If it does not exist in the database, it notifies the client.



## Review
The review schema is as follows:
* \_id (e.g. 5ea95743b78d3762f88873c1)
* venueId (e.g. v1)
* userId (e.g. u1)
* datePosted (e.g. 2020-04-29T10:30:27.204+00:00)
* content (e.g. This is u2's first review for v1)
* rating (e.g. 2)

The review component has the following functionalities:
1. *getAllReviews: GET /review/*
2. *updateReview: PATCH  /review/:venueId/*
3. *addReview: POST /review/*
4. *getReviewByIDs: GET /review/byids/:venueId/:userId/*
5. *getReviewByVenueID: GET /review/byvenue/:venueId/*
6. *getReviewByUserID: GET /review/byuser/:userId/*
7. *deleteReview: DELETE /review/:venueId/*
