import re
import math
from mturk.manage_hit import *
from mturk.create_hit import *
from aitoolkit import create_app
from aitoolkit.enum import TaskType, HITType

app=create_app()

# ------------------ reflection-practice workflow w/ cutomized interface (mturk version) --------------------------------------------------
def objectstory_workflow_hit(image_id, hit_type, num_of_assignments, **kwargs):
    hit_id = create_objectstory_hit(image_id, hit_type, num_of_assignments)
    
    return hit_id


if __name__ == "__main__":
    image_ids = [4, 5]
    for img_id in image_ids:
        h_id = objectstory_workflow_hit(img_id, HITType.OBJECTSTORY.value, 2)
        print(h_id)
    