CoffeeREST
==========

Description
-----------

RESTful service beeing able to distibute information about coffee pots 
DETTE ER EN ANNEN LINJE FRA ET ANNET STED
brewed on Gløshaugen, and be able to recieve data from several devices, 
like Arduino or Raspberry Pi.


Setup
-----

To set up a working database, install MongoDB and edit config.js with ip and port of the database, and the name of the MongoDB collection.

To get some sample data, run

    python util/CoffeeTxt2CoffeeDB.py

To start the server, run:

    node server.js


