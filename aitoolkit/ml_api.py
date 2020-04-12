import numpy as np
import tensorflow as tf

import requests
import pathlib
from PIL import Image
from io import BytesIO

from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util

# patch tf1 into `utils.ops`
utils_ops.tf = tf.compat.v1

# Patch the location of gfile
tf.gfile = tf.io.gfile

category_index = label_map_util.create_category_index_from_labelmap("ml_models/data/mscoco_label_map.pbtxt", use_display_name=True)

def load_model(model_name):
  model_dir = "ml_models/%s" % model_name
  model_dir = pathlib.Path(model_dir)
  model = tf.saved_model.load(str(model_dir))
  model = model.signatures['serving_default']

  return model

def load_model_remote(model_name):
  base_url = 'http://download.tensorflow.org/models/object_detection/'
  model_file = model_name + '.tar.gz'
  model_dir = tf.keras.utils.get_file(
    fname=model_name, 
    origin=base_url + model_file,
    untar=True)

  model_dir = pathlib.Path(model_dir)/"saved_model"
  model = tf.saved_model.load(str(model_dir))
  model = model.signatures['serving_default']
  
  return model  

def run_inference_for_single_image(model, image):
  image = np.asarray(image)

  input_tensor = tf.convert_to_tensor(image)
  input_tensor = input_tensor[tf.newaxis,...]

  # Run inference
  output_dict = model(input_tensor)

  # All outputs are batches tensors.
  # Convert to numpy arrays, and take index [0] to remove the batch dimension.
  # We're only interested in the first num_detections.
  num_detections = int(output_dict.pop('num_detections'))
  output_dict = {key:value[0, :num_detections].numpy() 
                 for key,value in output_dict.items()}
  output_dict['num_detections'] = num_detections

  # detection_classes should be ints.
  output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)
   
  # Handle models with masks:
  if 'detection_masks' in output_dict:
    # Reframe the the bbox mask to the image size.
    detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
              output_dict['detection_masks'], output_dict['detection_boxes'],
               image.shape[0], image.shape[1])      
    detection_masks_reframed = tf.cast(detection_masks_reframed > 0.5,
                                       tf.uint8)
    output_dict['detection_masks_reframed'] = detection_masks_reframed.numpy()
    
  return output_dict

def show_inference(model, image):
  image_np = np.array(image)

  output_dict = run_inference_for_single_image(model, image_np)

  return output_dict  

def get_predictions_from_url(model, image_url):
  res = requests.get(image_url)
  image = Image.open(BytesIO(res.content))
  predictions = show_inference(model, image)
  num = int(predictions["num_detections"])
  
  output_list = []
  boxes = predictions["detection_boxes"].tolist()
  scores = predictions["detection_scores"].tolist()
  
  for i in range(num):
      output_list.append(
          {
              "label": category_index[predictions["detection_classes"][i]]["name"],
              "box": boxes[i],
              "score": scores[i]
          }
      )
  result = {
    "image_size": [image.width, image.height],
    "predictions": output_list
  }
  return result
