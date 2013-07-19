#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Jimtrim
#
# Created:     17.07.2013
# Copyright:   (c) Jimtrim 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import time
from urllib2 import urlopen
from datetime import datetime
from pymongo import MongoClient



def main(uri="http://draug.online.ntnu.no/coffee_log.txt",
            ip='127.0.0.1',
            port=27018,
            dbName='coffee',
            collectionName='online'
        ):
    f = urlopen(uri)
    lines = f.readlines()
    f.close()

    client = MongoClient(ip, port)
    db = client[dbName]
    collection = db[collectionName]

    print 'Connected to', ip, ' in database', dbName,\
            'with collection', collectionName

    for line in lines:
        line = line.strip().split(":", 1)
	count = int(line[0])
        try:
            line = datetime.strptime(str(line[1]) + " 2013", "%d. %B %H:%M:%S %Y")
        except ValueError:
            try:
                line = datetime.strptime(str(line[1]), "%d. %B %Y %H:%M:%S")
            except ValueError:
                print 'VALUE ERROR'

        # Check wether the exact timestamp exists in the database
        if not (collection.find_one({"date": line })):
            print "NOT A MATCH"
            assert(collection.insert({"numberThisDay": count, "date": line }))

    print 'DONE'

    f.close()

if __name__ == '__main__':
    main()
