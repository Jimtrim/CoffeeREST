#-------------------------------------------------------------------------------
# Name:        CoffeBot
# Purpose:     Provide an Object Oriented way to submit and retrieve data from
#              the Online Notifier database for coffe logs
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

def Pot(numberToday, madeAt):
    return {"numberToday": numberToday, "madeAt": madeAt}


class CoffeeDB:
    def __init__(self, path):
        self.path = path
        self.con = None
        self.cur = None

    def connect(self):
        if self.con: self.disconnect();
        try:
            self.con = sqlite3.connect(self.path)
            self.cur = self.con.cursor()

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            sys.exit(1)

    def disconnect(self):
        self.con.close();

    def putPot(self, pot):
        # Pot: tuble containing numberToday and madeAt. ex: (3, datetime.now() )
        try:
            self.cur.execute("INSERT INTO Pots(numberToday, madeAt) VALUES (?, ?)",
                (pot["numberToday"], pot["madeAt"]))
            self.con.commit()
            return True
        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return False


    def getNewestPot(self):
        try:
            max_id = self.cur.execute("SELECT max(id) FROM Pots")
            max_id = str(max_id.fetchone()[0])
            data = self.cur.execute("SELECT numberToday, madeAt FROM POTS WHERE id in (?)", max_id).fetchone()
            return Pot(data[0], data[1])
        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None
        return True

    def getDay(self, day, month=str(datetime.month), year=str(datetime.year) ):
        print day,'-',month, '-', year

    def getMonth(self, month, year=str(datetime.year)):
        print month, '-', year

    def getYear(self, year ):
        try:
            data = self.cur.execute("SELECT numberToday, madeAt FROM Pots "+\
    "WHERE DATETIME(pots.madeAt) < '"+year+"-12-31 23:59:59' AND "+\
    "DATETIME(pots.madeAt) > '"+year+"-01-01 00:00:00' ORDER BY madeAt")
            result = []
            for row in data:
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None


    def getAll(self):
        try:
            data = self.cur.execute("SELECT numberToday, madeAt FROM Pots ORDER BY madeAt")
            result = []
            for row in data:
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None


    def install_db(self):
        self.cur.execute("DROP TABLE IF EXISTS Pots")
        self.cur.execute("CREATE TABLE Pots(id INTEGER PRIMARY KEY AUTOINCREMENT,"+\
            "numberToday INT, madeAt TIMESTAMP)")


# Main class, will only be called if this file is run directly
def main():
    DEBUG = True
    testPots = (
        Pot(1, datetime.now().replace(year=2012)),
        Pot(1, datetime.now().replace(month=1) - timedelta(hours=1)),
        Pot(2, datetime.now().replace(month=1)),
        Pot(1, datetime.now() - timedelta(weeks=1)),
        Pot(1, datetime.now() - timedelta(hours=2)),
        Pot(2, datetime.now() - timedelta(hours=1)),
        Pot(3, datetime.now())
    )

    db = CoffeeDB('coffee_test.db')

    db.connect()
    if DEBUG:
        db.install_db()
        for pot in testPots:
            print db.putPot(pot)

    # Newest
    data = db.getNewestPot()
    print '-', data

    # Year
    data = db.getYear("2012")
    print '--', data

    db.getMonth("05")
    db.getDay("")

    # All
    data = db.getAll()
    print '---', data

    db.disconnect()

if __name__ == '__main__':
    main()

