from django.apps import AppConfig
# from .cronJob import cron

class AppointmentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Appointment'

    # def ready(self):
    #     print("Starting Scheduler ...")
    #     cron.my_cron_job()
