from django.test import TestCase
import pytz
import datetime
# Create your tests here.
d=datetime.datetime.strptime('9:30','%H:%M')
time_zone = pytz.timezone('Asia/Kolkata')
time = datetime.datetime.now(tz=time_zone).strftime('%H:%M')
dd =datetime.datetime.strptime(time,'%H:%M')
print(d.time())
print(dd.time() < d.time())