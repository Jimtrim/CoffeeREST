#-------------------------------------------------------------------------------
# Name:        Kaffe_db
# Purpose:
#
# Author:      Jimtrim
#
# Created:     16.05.2013
# Copyright:   (c) Jimtrim 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import sqlite3
import sys
from datetime import datetime, timedelta

DEBUG = True


earlier = datetime.now() - timedelta(hours=2)
early = datetime.now() - timedelta(hours=1)
now = datetime.now()

testPot = (
    (1, earlier),
    (2, early),
    (3, now)
)

def main():
    print "ARGS:",sys.argv
    con = None

    try:
        con = sqlite3.connect('kaffe.db')
        cur = con.cursor()

        if len(sys.argv) > 1 and sys.argv[1] == "install":
            install(cur)

        cur.executemany("INSERT INTO Pots(numberToday, madeAt) VALUES (?, ?)", testPot )
        data = cur.execute('SELECT * FROM Pots')
        print data.fetchall()


    except sqlite3.Error, e:

        print "Error %s:" % e.args[0]
        sys.exit(1)

    finally:

        if con:
            con.close()

def install(cur):
    cur.execute("DROP TABLE IF EXISTS Pots")
    cur.execute("CREATE TABLE Pots(Id INTEGER PRIMARY KEY AUTOINCREMENT, numberToday INT, madeAt TIMESTAMP)")

if __name__ == '__main__':
    main()
