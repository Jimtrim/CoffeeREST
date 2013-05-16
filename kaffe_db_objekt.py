#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Jimtrim
#
# Created:     16.05.2013
# Copyright:   (c) Jimtrim 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import sys
import sqlite3
from datetime import datetime, timedelta

class CoffeDB:
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
        self.cur.execute("INSERT INTO Pots(numberToday, madeAt) VALUES (?, ?)", pot )


    def install_db():
        pass

try:
    db = CoffeDB('koffe.db')
    db.connect()


con = None

try:
    con = sqlite3.connect('kaffe.db')
    cur = con.cursor()

    if len(sys.argv) > 1 and sys.argv[1] == "install":
        install(cur)

    cur.executemany("INSERT INTO Pots(numberToday, madeAt) VALUES (?, ?)", testPot )
    data = cur.execute('SELECT * FROM Pots')
    print data.fetchall()



def install(cur):
    cur.execute("DROP TABLE IF EXISTS Pots")
    cur.execute("CREATE TABLE Pots(Id INTEGER PRIMARY KEY AUTOINCREMENT, numberToday INT, madeAt TIMESTAMP)")

