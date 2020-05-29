from enum import Enum

class DataType(Enum):
    IMAGEDATA = "imagedata"
    TEXTDATA = "textdata"

class TaskType(Enum):
    STORYTELLING = "storytelling"
    GROUPING = "grouping"
    VERIFICATION = "verification"

class HITType(Enum):
    OBJECTSTORY = "objectstory"

class Status(Enum):
    WORKING = 0
    FINISH = 1
    ACCEPT = 2
    REJECT = 3
    COMPLETE = 4