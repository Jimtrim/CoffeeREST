#-------------------------------------------------------------------------------
# Name:        CoffeBot
# Purpose:     Give an Object Oriented way to submit and retrieve data from
#              the Online Notifier database
#
# Author:      Jimtrim
#
# Created:     16.05.2013
# Copyright:   (c) Jimtrim 2013
# Licence:     Beerware
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import sys
import sqlite3
from datetime import datetime, timedelta

class CoffeeDB:
    def __init__(self, path):
        self.path = path
        self.con = None
        self.cur = None

    def connect(self):
        try:
            self.con = sqlite3.connect(self.path)
            self.cur = con.cursor()

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            sys.exit(1)

        finally:
            if con: con.close();

    def putPot(self, pot):
        # Pot: tuble containing numberToday and madeAt. ex: (3, datetime.now() )
        try:
            print self.cur.execute("INSERT INTO Pots(numberToday, madeAt) VALUES (?, ?)", pot )
            return True
        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return False


    def getNewestPot(self):
        try:
            return self.cur.execute("SELECT max(id) FROM Pots")
        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None
        return True

    def getDay(self, day, month=datetime.month, year=datetime.year):
        raise NotImplementedError
    def getMonth(self, month, year=datetime.year):
        raise NotImplementedError
    def getYear(self, year):
        raise NotImplementedError
    def getAll(self):
        raise NotImplementedError


    def install_db():
        self.cur.execute("DROP TABLE IF EXISTS Pots")
        self.cur.execute("CREATE TABLE Pots(Id INTEGER PRIMARY KEY AUTOINCREMENT, numberToday INT, madeAt TIMESTAMP)")


def main():
    testPots = (
        (1, timestamp.now - timeDelta(month=1)),
        (1, timestamp.now - timeDelta(hour=2)),
        (2, timestamp.now - timeDelta(hour=1)),
        (3, timestamp.now),
    )

    db = CoffeeDB('coffee_test.db')


if __name__ == '__main__':
    main()

