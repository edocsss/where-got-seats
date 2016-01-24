import serial


class SerialController():
    def __init__(self, port, baudRate):
        self.port = port
        self.baudRate = baudRate
        self.ser = None

    def start(self):
        self.ser = serial.Serial(port=self.port, baudrate=self.baudRate)
        self.ser.flushInput()
        self.ser.flushOutput()

    def end(self):
        print("Closing serial port: {}!".format(self.port))
        self.ser.close()

        print("Serial port: {} closed!".format(self.port))
        self.ser = None

    def write(self, data):
        data = str(data)
        print("Sending data: " + data)
        self.ser.write(data.encode()) # Encode data into a binary form

    # This only reads RAW DATA
    def read(self):
        data = self.ser.readline()
        return data

    def read_string(self):
        data = self.read()
        return data.decode().strip()

    def read_int(self):
        data = self.read()
        return int(data)

    # Boolean is sent in the form of a number, but read as a BYTE object
    # Need to convert this BYTE object to an INTEGER, BEFORE converting to BOOLEAN
    # If convert to BOOLEAN directly, 0 or 1 is considered as TRUE since they were in the form of BYTE --> b'1' or b'0' --> similar to String but in the form of a BYTE object
    def read_bool(self):
        data = self.read_int()
        return bool(data)