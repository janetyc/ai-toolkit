# -*- coding: utf-8 -*-
import os

from aitoolkit import create_app, firebase


app = create_app()
storage = firebase.storage()

def upload_image(server_path, local_path):


	print(os.path.dirname(os.getcwd()))
	
	path = "%s/%s" % (os.path.dirname(os.getcwd()), local_path)
	print(path)
	# as admin
	storage.child(server_path).put(path)

	# as user
	#storage.child("images/example.jpg").put("example2.jpg", user['idToken'])

def get_image_url(server_path):
	return storage.child(server_path).get_url(None)


if __name__ == "__main__":
	upload_image("images/cat.jpg", "ai-toolkit/scripts/images/cat.jpg")
	url = get_image_url("images/cat.jpg")
	print(url)