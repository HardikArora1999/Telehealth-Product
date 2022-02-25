# Telehealth

## How to setup?
- Create a virtual enviornment.
    `python -m venv env`
- Activate virtual enviorment by following command
    `.\env\Scripts\activate`
- Install all the required packages using command
    `pip install -r requirements.txt`
- Configure your database from settings file
- Make migrations
    `python manage.py migrate`
- To run server, run:-
    `python manage.py runserver`
- To run server for slot generation, use:-
    `python manage.py runserver --noreload`