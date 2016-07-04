from datetime import datetime


def convert_24_hour_to_12_hour(time_str):
    if time_str is None:
        return ""
    d = datetime.strptime(time_str, "%H:%M")
    return d.strftime("%I:%M %p")


def convert_date_to_human_readable(date_obj):
    # d = datetime.strptime(date_str, '%Y-%m-%d')
    return date_obj.strftime("%b. %d, %Y")

