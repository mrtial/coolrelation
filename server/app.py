from flask import Flask, request, render_template, redirect, url_for
from flask_restful import Resource, Api
from marshmallow import Schema, fields, post_load
from flask_sqlalchemy import SQLAlchemy 
import csv

# INIT
app = Flask(__name__, template_folder='../client/views', static_folder="../client")
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URL'] = 'postgres://localhost/coolrelation'
app.url_map.strict_slashes = False 
db = SQLAlchemy(app)


# CREATE TABLE
class MatrixData(db.Model):

	__tablename__ = "matrix_data"

	id = db.Column(db.Integer, primary_key=True)
	data = db.Column(db.Text)

	def __init__(self, data):
		self.data = data

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
	def get(self):
		return schema.dump(MatrixData.query.all(), many=True)

	def post(self):

		file = request.files['file'].stream.read().decode("UTF8");
		new_data = csv.reader(file)

		from IPython import embed; embed()

		db.session.add(file)
		db.session.commit()
		return file

api.add_resource(MatrixAllApi,'/api/data')



# ROUTES
@app.route('/')
def root():
	return render_template('layout.html')

@app.route('/<path:path>')
def catch_all(path):
	return render_template('layout.html')



# LISTEN
if __name__ == "__main__":
	app.run(debug=True, port=3000)