from flask import render_template
from init import app,mqtt,socketio,db
from models import Data
from datetime import datetime
import json

class SensorData:
   def __init__(self,id,temperature,humidity,time):
      self.id = id
      self.temperature = temperature
      self.humidity = humidity
      self.time = time


def HandleChartQuery(num):
   with app.app_context():
      query = db.select(Data).order_by(Data.id.desc()).limit(num)
      print("--- QUERY ---\n:",query)
      data_list = db.session.execute(query).scalars().fetchall()
      data_list.reverse()
      print("\n",data_list)
      sensor_data = []
      for row in data_list:
         sensor_data.append(SensorData(id = row.id,
                                       temperature = row.temperature,
                                       humidity = row.humidity,
                                       time = row.time))
      json_data = json.dumps([vars(d) for d in sensor_data])
      print(json_data,'\n')
   return json_data
      
@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
   mqtt.subscribe('data/hum_temp')

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
   data = dict(
      topic=message.topic,
      payload=message.payload.decode()
   )
   now = (datetime.now()).strftime('%H:%M:%S')
   datastr = data['payload'].split('-')
   datastr.append(now)
   socketio.emit('mqtt_message_recent', data = datastr)
   print("hum value: ",datastr[1], "temp value: ", datastr[0], "time: ",datastr[2])
   dataobj = Data(temperature = datastr[1], humidity = datastr[0], time = now)
   with app.app_context():
      db.session.add(dataobj)
      db.session.commit()
      
@socketio.on('connect_homepage')
def get_clientconnect(data):
   print('\ndu lieu nhan duoc:',data)
   socketio.emit('chart_getdata',data = HandleChartQuery(10))

@app.route('/')
def home():
   recentdata = db.session.execute(db.select(Data).order_by(Data.id.desc())).scalar()
   return render_template('home.html',
                          tempdata = recentdata.temperature,
                          humdata = recentdata.humidity)

if __name__ == '__main__':
   socketio.run(app, host='localhost', port=5000, use_reloader=False, debug=True)
