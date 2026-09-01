from pywebpush import webpush, WebPushException
import json
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64
import requests

class WebPush:
    def __init__(self, data, endpoint, public_key, auth):
        #self.endpoint = 'https://fcm.googleapis.com/fcm/send/dD0MqRX0BKs:APA91bGorxedryC9FP_SpBr6Tezbsk9KODYkl6P3m0mlBcP07UtxN5xvqcvFMQ7-v8JObacqn7BfqWA2Ol8wfBlmkPx6nXYbwblTsmdRUt1YMHP6LAUP8JbeU0zTRcgDieLiwDDobRC-'
        #self.public_key = 'BD61EdvXEuR2apku5dFSNXAIVIdmLHZN6L7sq5rgpCPYYNBTJXhF4YtoWww8Sqq_Z5S18ax7cdAbXQmvwSLYvnc'
        self.endpoint = endpoint
        self.public_key = public_key
        self.auth = auth
        self.private_key = '07H50TamGMaLqjozcjT8nQApe59EsBdQvuz3_NAcB5c'
        #self.auth = 'sPufQAtsK_BpsI8IifzlgQ'
        
        self.data =  json.dumps({
            "title": data['title'],
            "body": data['body'],
            "icon": data['icon'],
            "url": data['url']
        })        
        
    def push(self):
        print('pushing to ' + self.endpoint)
        try:
            webpush(
                self.get_subscription(),
                data=self.get_data(),
                vapid_private_key=self.get_private_key(),
                vapid_claims={
                    "sub": "mailto:you@example.com"
                }
            )
            print("✅ Push sent!")
            return {
                'status': 'success',
                'endpoint': self.endpoint,
                'message': 'push success'
            }
        except WebPushException as ex:
            print("❌ Failed to send push:", repr(ex))
            return {
                'status': 'error',
                'endpoint': self.endpoint,
                'message': repr(ex)
            }
        pass
    
    def check_expired_subscription(self, endpoint):
        # Update instance endpoint
        self.set_endpoint(endpoint)
        try:
            webpush(
                self.get_subscription(),
                data="ping",
                vapid_private_key=self.get_private_key(),
                vapid_claims={"sub": "mailto:you@example.com"},
                ttl=0
            )

            return {
                "endpoint": self.endpoint,
                "status": "valid"
            }

        except WebPushException as ex:
            return {
                "endpoint": self.endpoint,
                "status": "expired",
                "message": repr(ex)
            }


    
    
    def generate_key(self):
        private_key = ec.generate_private_key(ec.SECP256R1())

        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        public_key = private_key.public_key()

        public_numbers = public_key.public_numbers()
        x = public_numbers.x.to_bytes(32, 'big')
        y = public_numbers.y.to_bytes(32, 'big')
        uncompressed = b'\x04' + x + y

        vapid_public_key = base64.urlsafe_b64encode(uncompressed).rstrip(b'=').decode('utf-8')
        vapid_private_key = base64.urlsafe_b64encode(
            private_key.private_numbers().private_value.to_bytes(32, 'big')
        ).rstrip(b'=').decode('utf-8')

        self.set_public_key(vapid_public_key)
        self.set_private_key(vapid_private_key)
        
    
    def set_data(self, s):
        self.data = json.dumps(s)
        
    def set_endpoint(self, s):
        self.endpoint = s
    
    def set_public_key(self, s):
        self.public_key = s
    
    def set_private_key(self, s):
        self.private_key = s
        
    def set_auth(self, s):
        self.auth = s
        
    def get_endpoint(self):
        return self.endpoint
    
    def get_public_key(self):
        return self.public_key
    
    def get_private_key(self):
        return self.private_key
    
    def get_auth(self):
        return self.auth
    
    def get_subscription(self):
        return {
            "endpoint": self.get_endpoint(),
            "keys": {
                "p256dh": self.get_public_key(),
                "auth": self.get_auth()
            }
        }
    def get_data(self):
        return self.data
    