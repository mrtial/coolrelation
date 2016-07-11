from flask import Flask, request, render_template, redirect, url_for
from flask_restful import Resource, Api
from marshmallow import Schema, fields, post_load
from flask_sqlalchemy import SQLAlchemy 
import csv

# APP INIT
app = Flask(__name__, template_folder='../client/views', static_folder="../client")
api = Api(app)

# DATABASE CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/coolrelation'
app.url_map.strict_slashes = False 
db = SQLAlchemy(app)


# CREATE TABLE
class MatrixData(db.Model):

	__tablename__ = "matrix_data"

	id = db.Column(db.Integer, primary_key=True)
	data = db.Column(db.Text)
	# user_id = db.Column(db.Text)

	def __init__(self, data):
		self.data = data

	# display when exame the instance:
	def __repr__(self):
	  return 'data : {}'.format(self.data)

db.create_all()


# CREATE SCHEMA
class MatrixSchema(Schema):
	id = fields.Integer()
	data = fields.String()

	# @post_load
	# def make_matrix(self, kwargs):
	# 	return MatrixData(**kwargs)

schema = MatrixSchema()


# API ROUTE
class MatrixAllApi(Resource):
	# get specific data from query
	def get(self):
		# from IPython import embed; embed()
		# get id = 1
		return schema.dump(MatrixData.query.get_or_404(1))


	def post(self):
		file = request.files['file'].stream.read().decode("UTF8");
		d = MatrixData(file)
		result = schema.dump(d)

		# [other processes to be implemented]
		# from myModel import DataProcess
		# sned to DataProcess()
		# return data in json and other intitial setting

		# === SAVE TO DATABASE ===
		# db.session.add(d)
		# db.session.commit()
		
		return result


class GenerateD3(Resource):
	def post(self):
		file = request.files['file'].stream.read().decode("UTF8");
		d = MatrixData(file)
		result = schema.dump(d)

		return result


# The route to use this api resource
api.add_resource(MatrixAllApi,'/api/data')
api.add_resource(GenerateD3, '/api/generate')



# ROUTES for angular
@app.route('/')
def root():
	return render_template('layout.html')

@app.route('/<path:path>')
def catch_all(path):
	return render_template('layout.html')



# LISTEN
if __name__ == "__main__":
	app.run(debug=True, port=3000)

	