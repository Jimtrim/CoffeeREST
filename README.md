CoffeeBot
=========

Install
-------

In order to set up the database, simply run *python database/coffeeDB.py install*, and 
it will generate a sqlite3-file in the crrent working directory, and populate 
it with data.

To get the server running, run *python service.py*, and your server will be running 
at localhost:8080. The implemented paths are as follows, *variable* is optional:

* /coffee/
* /coffee/all/
* /coffee/year/*year*/
* /coffee/month/*month*/*year*/
* /coffee/day/*day*/*month*/*year*/

If you want to debug and contribute, without ruining your running database, use
*python CoffeeDB.py install debug* to start a test-database, and use 
*python CoffeeDB.py debug* to use the testing database without populationg 
data.





