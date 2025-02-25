Tycker att projektet har gått bra då det jag har velat lägga till har gått. Har haft lite svårigheter med vissa saker men det har fixat sig.
Jag har också lärt mig mer om sql queries. 

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

För att arbeta med säkerhet så har jag använt mig av express-validator för att göra flera saker. Så som att kolla efter korrekta inputs t.ex en integer och tar inte emot svaren ifall det är någonting annat, gör så att man inte kan skriva in ett skript där. 

En extra funktion som jag har gjort är att skapa konton och få en lista på alla konton. Detta var rätt simpelt från vad jag kommer ihåg eftersom vi hade redan gjort liknande saker fast med tweets. 
