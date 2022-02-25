# from telehealth.Appointment.models import Appointment
# import cronjobs
from apscheduler.schedulers.background import BackgroundScheduler
from Appointment.views import AppointmentView,ReminderView
from apscheduler.triggers.cron import CronTrigger

def task():
    print("I am cron")


def my_cron_job():

    # RUN_EVERY_MINS = 6000 #min
    # schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    scheduler = BackgroundScheduler()
 
    # scheduler.add_job(AppointmentView.generateSlots , id="appointment_trigger",
    # replace_existing=True, trigger=CronTrigger(
    #     hour = '00',minute ='01'
    # ))

    scheduler.add_job(ReminderView.send_reminder , id="reminder_trigger",
    replace_existing=True, trigger=CronTrigger(
        hour = '7',minute ='00'
    ))
    #scheduler.add_job(ReminderView.reminder ,"interval", minutes= 60, id="reminder_trigger",replace_existing=True)
    scheduler.start()
