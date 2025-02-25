| GET  | /                  | Look at all tweets                                                  |
|------|--------------------|---------------------------------------------------------------------|
| GET  | /tweets            | Look at all tweets                                                  |
| GET  | /tweets/:id/edit   | Edit a certain tweet dependant on its id                            |
| POST | /tweets/edit       | Posts the new tweet to the db and updates its "last edited at" time |
| POST | /createNoID        | Create a post with a fixed author id (create button on homepage)    |
| GET  | /create/account    | Open page to create a new account                                   |
| POST | /create/account    | Post account to db                                                  |
| GET  | /accounts          | Get a list of all accounts                                          |
| GET  | /tweets/:id/delete | Delete a tweet based on id                                          |
| POST | /delete            | Deletes the tweet from above                                        |
| GET  | /create            | Go to the create tweet page                                         |
| POST | /create            | Posts the tweet                                                     |
