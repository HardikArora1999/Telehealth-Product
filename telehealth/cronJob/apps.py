from django.apps import AppConfig


class CronJobConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cronJob'

    # def __init__():
    #     print("Inside constructor")

    def ready(self):
        from . import cron
        print("Starting Scheduler ...")
        cron.my_cron_job()
