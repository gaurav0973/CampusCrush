# CampusCrush 


## authRouter
- POST /signup
- POST /login
- POST /logout


## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId


## userRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed -> gets the profile of all the users


-           TOTAL = 13 APIs

