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
import json


def main():
    db = CoffeeDB('notify.db')


    @route('/coffee')
    @route('/coffee/')
    def index():
        db.connect()
        json_string = json.dumps(db.getNewestPot())
        return template("{{json_string}}", json_string=json_string)
        db.disconnect()

    @route('/coffee/all')
    @route('/coffee/all/')
    def get_all():
        db.connect()
        json_string = json.dumps(db.getAll())
        return template("{{json_string}}", json_string=json_string)
        db.disconnect()

    @route('/coffee/year')
    @route('/coffee/year/')
    @route('/coffee/year/<year>')
    @route('/coffee/year/<year>/')
    def find_year(year=""):
        db.connect()
        json_string = json.dumps(db.getYear(year))
        return template("{{json_string}}", json_string=json_string)
        db.disconnect()

    @route('/coffee/month')
    @route('/coffee/month/')
    @route('/coffee/month/<month>')
    @route('/coffee/month/<month>/')
    @route('/coffee/month/<month>/<year>')
    @route('/coffee/month/<month>/<year>/')
    def find_month(month="", year=""):
        db.connect()
        json_string = json.dumps(db.getMonth(month=month, year=year))
        return template("{{json_string}}", json_string=json_string)
        db.disconnect()

    @route('/coffee/day')
    @route('/coffee/day/')
    @route('/coffee/day/<day>')
    @route('/coffee/day/<day>/')
    @route('/coffee/day/<day>/<month>')
    @route('/coffee/day/<day>/<month>/')
    @route('/coffee/day/<day>/<month>/<year>')
    @route('/coffee/day/<day>/<month>/<year>/')
    def find_day(day="", month="", year=""):
        db.connect()
        json_string = json.dumps(db.getDay(day, month, year))
        return template("{{json_string}}", json_string=json_string)
        db.disconnect()




    run(host='localhost', port=8080)

if __name__ == '__main__':
    main()
