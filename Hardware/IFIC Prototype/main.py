import SerialController
import requests

BASE_URL = 'http://localhost:3000'
LOGIN_URL = BASE_URL + '/api/login'
SEAT_AVAILABILITY_UPDATE_URL = BASE_URL + '/api/hardware/update/seat'

SEAT_UPDATE_SUCCESSFUL_CODE = 1
SEAT_UPDATE_UNSUCCESSFUL_CODE = 0

if __name__ == '__main__':
    BAUD_RATE = 9600
    PORT = "COM3"
    LOGIN_USER_ID = None
    LOGIN_AUTH_TOKEN = None
    LOGIN_EMAIL = "hardware.updater@wheregotseats.com"
    LOGIN_PASSWORD = "12345678"

    serial_controller = SerialController.SerialController(PORT, BAUD_RATE)
    serial_controller.start()

    # Keep listening for any new data from Arduino
    while True:
        print("Waiting for hardware ID...")
        hardware_id = serial_controller.read_string()

        print("Waiting for seat availability status...")
        seat_availability = serial_controller.read_bool()

        # Perform login authentication if User ID and authentication token are not there yet
        if not LOGIN_USER_ID or not LOGIN_AUTH_TOKEN:
            print("Sending LOGIN request...")
            login_request = requests.post(LOGIN_URL, data={ "email": LOGIN_EMAIL, "password": LOGIN_PASSWORD })

            if login_request.status_code == 200:
                print('Login successful!')
                LOGIN_USER_ID = login_request.json()['data']['userId']
                LOGIN_AUTH_TOKEN = login_request.json()['data']['authToken']

            elif login_request.status_code == 401:
                print('Login unsuccessful!')
                print('Check email address or password!')

        print('Sending seat availability to server...')
        print('Hardware ID: {0}, Seat Availability: {1}'.format(hardware_id, seat_availability))

        login_headers = {
            'X-User-Id': LOGIN_USER_ID,
            'X-Auth-Token': LOGIN_AUTH_TOKEN
        }

        data = {
            'hardwareId': hardware_id,
            'availability': seat_availability
        }

        # MUST USE JSON FIELD
        # Otherwise, the BOOLEAN AVAILABILITY value will not be correctly processed
        seat_availability_update_request = requests.put(SEAT_AVAILABILITY_UPDATE_URL, json=data, headers=login_headers)

        if seat_availability_update_request.status_code == 200 and seat_availability_update_request.json()['result']:
            print("Seat availability update successful!")
            print("Sending acknowledgement to Arduino...")

            serial_controller.write(SEAT_UPDATE_SUCCESSFUL_CODE)
            print("Sending acknowledgement to Arduino done!")

        elif seat_availability_update_request.status_code == 401:
            print("Seat availability update unsuccessful!")
            print("Unauthorized access!")
            serial_controller.write(SEAT_UPDATE_UNSUCCESSFUL_CODE)

        elif not seat_availability_update_request.json()['result']:
            print("Seat availability update unsuccessful!")
            print("Internal server error!")
            serial_controller.write(SEAT_UPDATE_UNSUCCESSFUL_CODE)

    print()
    print()