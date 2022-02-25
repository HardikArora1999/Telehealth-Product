from twilio.rest import Client

# Your Account SID from twilio.com/console
account_sid = "AC3e7298342ca26a63a7e974b237e08b31"
# Your Auth Token from twilio.com/console
auth_token  = "09f9455a6dce1f288066585a9b6d8b67"

client = Client(account_sid, auth_token)

# call = client.calls.create(
#     to="+917503001144", 
#     from_="+19417578212",
#     url="http://demo.twilio.com/docs/voice.xml")
#     # body="Hello from Python!"
message = client.messages \
    .create(
        body="This is a test message",
        from_='+19417578212',
        to='+919993299208'
        )
print(message.sid)
