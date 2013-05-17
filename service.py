#-------------------------------------------------------------------------------
# Name:        Service
# Purpose:
#
# Author:      Jimtrim
#
# Created:     17.05.2013
# Copyright:   (c) Jimtrim 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------
#!/usr/bin/env python


from database.coffeeDB import CoffeeDB, Pot
from bottle import route, run, template


def main():
    pass

    #@route('/hello/:name')
    #def index(name='World'):
    #    return template('<b>Hello {{name}}</b>!', name=name)
    #
    #run(host='localhost', port=8080)

if __name__ == '__main__':
    main()
