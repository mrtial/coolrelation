from flask import Flask, request, render_template, redirect, url_for
from flask_restful import Resource, Api
from marshmallow import Schema, fields, post_load
from flask_sqlalchemy import SQLAlchemy 
import pandas as pd 
import csv, json, re

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
	chart_option = db.Column(db.Text)
	chart_data = db.Column(db.Text)
	user_id = db.Column(db.Text)

	def __init__(self, chart_option, chart_data, user_id=None):
		self.chart_option = chart_option
		self.chart_data = chart_data
		self.user_id = user_id

	# display when exame the instance:
	def __repr__(self):
		return 'chart_option : {}, chart+data : {}'.format(self.chart_option, self.chart_data,)

db.create_all()


# CREATE SCHEMA
class MatrixSchema(Schema):
	id = fields.Integer()
	chart_option = fields.Dict()
	chart_data = fields.Dict()
	user_id = fields.String()

	# @post_load
	# def make_matrix(self, kwargs):
	# 	return MatrixData(**kwargs)

schema = MatrixSchema()


# API ROUTE
class AllMatrixApi(Resource):
	# get specific data from query
	def get(self):
		# from IPython import embed; embed()
		# get id = 1
		return schema.dump(MatrixData.query.get_or_404(1))


	def post(self):
		data = request.json

		chart_option = json.dumps(data[0])
		chart_data = json.dumps(data[1])
		user_id = json.dumps(data[2])

		# from IPython import embed; embed()
		# make file a python class instance so it can be store in db
		d = MatrixData(chart_option, chart_data, user_id)
	
		# === SAVE TO DATABASE ===
		db.session.add(d)
		db.session.commit()
		
		# return 
		print ("add to db")


class GenerateD3(Resource):
	def post(self):
		file = request.files['file'].stream.read().decode("UTF8");

		# TODO: Move this section to myModel.py
		# ========================================
		# from myModel import DataProcess
		# sned to DataProcess()
		# return data in json and other intitial setting

		data =[]
		temp = file.split("\r\n")
		
		for row in temp:
			s = re.split('(?!\B"[^"]*),(?![^"]*"\B)',row)
			data.append(s)

		df = pd.DataFrame(data=data)


		# CREATE NODE
		node=[]
		for i in range(1,df.shape[0]):
			node.append({"name":df[0][i],"group":float(df[1][i])})

		# CREATE LINK
		link=[]
		for i in range(3,df.shape[1]+1):
			for j in range(2,i-1):
				link.append({"source":i-3,"target":j-2,"value":df[i-1][j-1]})

		# DEFAULT OPTION
		option=[
			{"chart_type":"structure_graph", "color":"d3.scale.category20()","cutoff":".5","radious":"5"}
		] 
		# option=[{"chart_type":"force_directed"}]
		# to json
		chart_data = json.dumps({"nodes":node,"links":link})
		chart_option = json.dumps({"option":option})
		result = {"chart_data":chart_data, "chart_option":chart_option}

		return result




# API ROUTES:
api.add_resource(AllMatrixApi,'/api/data')
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

	