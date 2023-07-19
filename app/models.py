from init import db
from sqlalchemy import Column,Integer,String,Float,DateTime

class Data(db.Model):
    __tablename__ = 'data'
    id = Column(Integer,primary_key=True, autoincrement=True)
    temperature = Column(String(10),nullable=False)
    humidity = Column(String(10),nullable=False)
    time = Column(String(20),nullable=False) 
if __name__ == '__main__':
    db.create_all()