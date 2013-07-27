CoffeeREST
==========

Description
-----------

RESTful service beeing able to distibute information about coffee pots 
brewed on Gløshaugen, and be able to recieve data from several devices, 
like Arduino or Raspberry Pi.


Setup
-----

To set up a working database, run:

    vagrant up
    python util/CoffeeTXT2CoffeeDB.py

To start the server, run:

    node server.js


