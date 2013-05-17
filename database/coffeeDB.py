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
from datetime import date, datetime, timedelta

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

    #### Function: putPot
    ## Saves a new pot into the database
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

    #### Function: getNewestPot
    ## Delivers the newst pot, to make it easy for existing programs to use
    ## the service
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

    #### Function: getDay
    ## Delivers all pots from a given day in a given month in a given year
    ## Defaults to the current day, month and year
    def getDay(self, day="", month="", year=""):
        if year == "": year = str(datetime.now().year)
        if month == "":
            month = str(datetime.now().month)
            if len(month) < 2: month = "0"+month
        if day == "":
            day = str(datetime.now().day)
            if len(day) < 2: day = "0"+day

        ts = datetime.strptime(day+month+year, "%d%m%Y").date()

        try:
            res = self.cur.execute("SELECT numberToday, madeAt FROM Pots "+\
    "WHERE pots.madeAt BETWEEN '"+str(ts)+" 00:00:00' AND '"+str(ts)+" 23:59:59'")

    #> '"+year+"-"+month+"-"+day+" 00:00:00' ORDER BY madeAt")
            result = []
            for row in res.fetchall():
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None


    #### Function: getMonth
    ## Delivers all pots from a given month in a given year
    ## Defaults to the current month and year
    def getMonth(self, month="", year=""):
        if year == "": year = str(datetime.now().year)
        if month == "":
            month = str(datetime.now().month)
            if len(month) < 2: month = "0"+month

        try:
            data = self.cur.execute("SELECT numberToday, madeAt FROM Pots "+\
    "WHERE DATETIME(pots.madeAt) < '"+year+"-"+month+"-31 23:59:59' AND "+\
    "DATETIME(pots.madeAt) > '"+year+"-"+month+"-01 00:00:00' ORDER BY madeAt")
            result = []
            for row in data.fetchall():
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None

    #### Function: getYear
    ## Delivers all pots from a given month in a given year
    ## Defaults to the current month and year
    def getYear(self, year=""):
        if year == "": year = str(datetime.now().year)
        try:
            data = self.cur.execute("SELECT numberToday, madeAt FROM Pots "+\
    "WHERE DATETIME(pots.madeAt) < '"+year+"-12-31 23:59:59' AND "+\
    "DATETIME(pots.madeAt) > '"+year+"-01-01 00:00:00' ORDER BY madeAt")
            result = []
            for row in data.fetchall():
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None

    #### Function: getAll
    ## Returns every pot ever tracked by CoffeBot. Use with care
    def getAll(self):
        try:
            data = self.cur.execute("SELECT numberToday, madeAt FROM Pots ORDER BY madeAt")
            result = []
            for row in data.fetchall():
                result.append(Pot(row[0], row[1]))
            return tuple(result)

        except sqlite3.Error, e:
            print "Error %s:" % e.args[0]
            return None

    def install_db(self):
        self.cur.execute("DROP TABLE IF EXISTS Pots")
        self.cur.execute("CREATE TABLE Pots(id INTEGER PRIMARY KEY AUTOINCREMENT,"+\
            "numberToday INT, madeAt TIMESTAMP)")


#### Main function
## This will only be called if this file is run indepentantly
def main(INSTALL=False, DEBUG=False):

    PATH = 'notify.db'
    if DEBUG: PATH = 'coffee_test.db'

    testPots = (
        Pot(1, datetime.now().replace(year=2012)),
        Pot(1, datetime.now().replace(month=1, hour=12)),
        Pot(2, datetime.now().replace(month=1, hour=15)),
        Pot(1, datetime.now().replace(day=15)),
        Pot(1, datetime.now().replace(hour=2)),
        Pot(2, datetime.now().replace(hour=12)),
        Pot(3, datetime.now().replace(hour=16))
    )

    db = CoffeeDB(PATH)

    db.connect()
    if INSTALL:
        db.install_db()
        for pot in testPots:
            print db.putPot(pot)

    # All functions printed
    print 'All - ', db.getAll()
    print 'Newest -', db.getNewestPot()
    print 'Year -', db.getYear("2012")
    print 'Month -', db.getMonth()
    print 'Day -', db.getDay("15")

    db.disconnect()

if __name__ == '__main__':
    DEBUG = len(sys.argv) and "debug" in sys.argv
    INSTALL = len(sys.argv) and "install" in sys.argv
    main(INSTALL, DEBUG)

