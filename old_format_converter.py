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
from datetime import datetime

def main(filename="testdata.txt"):
    f = open(filename, 'r')

    line = f.readline().strip().split(":", 1)
    while len(line)>1:
        print line
        line = datetime.strptime(
                line[1] + " 2012"
                , "%d. %B %H:%M:%S %Y")


        print line
        line = f.readline().strip().split(":", 1)
    print 'DONE'

    f.close()

if __name__ == '__main__':
    main()
