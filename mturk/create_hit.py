import os
import boto3

#use old boto question form
from boto.mturk.question import ExternalQuestion

from aitoolkit.enum import HITType, TaskType
from mturk.config import mturk_config

SANDBOX = mturk_config.getboolean('HIT Configuration', 'using_sandbox')
ACCESS_ID = mturk_config.get('AWS Access', 'aws_access_key_id')
SECRET_KEY = mturk_config.get('AWS Access', 'aws_secret_access_key')
HOST_SERVER = mturk_config.get('Server', 'hostname')

if SANDBOX == True:
    #HOST = 'mechanicalturk.sandbox.amazonaws.com'
    HOST = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
else:
    HOST = 'https://mturk-requester.us-east-1.amazonaws.com'

mturk = boto3.client('mturk',
   aws_access_key_id = ACCESS_ID,
   aws_secret_access_key = SECRET_KEY,
   region_name = 'us-east-1',
   endpoint_url = HOST
)

title_set = dict({
    HITType.OBJECTSTORY.value: "Use objects to tell a story based on an image"
})

description_set = dict({
    HITType.OBJECTSTORY.value: "Please write a story, including who, where, and what are they doing in a given image"
})

price_set = dict({
    HITType.OBJECTSTORY.value: 0.8
})

keywords_set = dict({
    HITType.OBJECTSTORY.value: "storytelling, object identification, object story",
})

duration = 60 * 120
max_assignments = 1
lifetime = 60 * 60 * 24 * 7
approval_delay = 60 * 60 * 24 * 14  # auto approve, two weeks
approve_requirement = 95
approve_num_hit = 100
frame_height = 800 # the height of the iframe holding the external hit



def create_objectstory_hit(image_id, hit_type, num_of_assignments=max_assignments, **kwargs):
    URL = '%s/#/annotateObjectStory/%s?using_sandbox=%s' % (HOST_SERVER, image_id, str.lower(str(SANDBOX)))
    hit_id = create_hit(hit_type, URL, num_of_assignments)

    return hit_id


def create_hit(hit_type, URL, num_of_assignments):
    title = title_set[hit_type]
    description = description_set[hit_type]
    keywords = keywords_set[hit_type]
    reward = price_set[hit_type]
    
    print(mturk.get_account_balance())

    # Old Qualification
    # qualifications = Qualifications()
    # qualifications.add(NumberHitsApprovedRequirement("GreaterThanOrEqualTo", approve_num_hit))
    # qualifications.add(PercentAssignmentsApprovedRequirement("GreaterThanOrEqualTo", approve_requirement))
    # qualifications.add(LocaleRequirement("EqualTo", "US"))
    # qualifications.add(LocaleRequirement("In", ['US', 'GB', 'IN'], required_to_preview=True))
    
    qualifications = [
        # {
        #     'QualificationTypeId': '00000000000000000071', #Worker_Locale
        #     'Comparator': 'In',
        #     'LocaleValues': [
        #         {
        #             'Country': "US"
        #         },
        #         {
        #             'Country': "GB"
        #         }
        #     ],
        #     'RequiredToPreview': True
        # },
        {   
            'QualificationTypeId': '00000000000000000040', #Worker_​NumberHITsApproved
            'Comparator': 'GreaterThanOrEqualTo',
            'IntegerValues': [approve_requirement]
        },
        {
            'QualificationTypeId': '000000000000000000L0', #Worker_​PercentAssignmentsApproved
            'Comparator': 'GreaterThanOrEqualTo',
            'IntegerValues': [approve_requirement]
        }
    ]

    questionform = ExternalQuestion(external_url=URL, frame_height=frame_height)

    # create HIT
    # create_hit_result = mturk.create_hit(
    #     title=title,
    #     description=description,
    #     keywords=keywords,
    #     question=questionform,
    #     reward=reward,
    #     qualifications=qualifications,

    #     duration=duration,
    #     max_assignments=num_of_assignments,
    #     lifetime=lifetime,
    #     approval_delay=approval_delay
    #     #response_groups = ( 'Minimal', 'HITDetail' ), # I don't know what response groups are
    # )
    create_hit_result = mturk.create_hit(
        MaxAssignments = num_of_assignments,
        AutoApprovalDelayInSeconds = approval_delay,
        LifetimeInSeconds = lifetime,
        AssignmentDurationInSeconds = duration,
        Reward = str(reward),
        Title = title,
        Keywords = keywords,
        Description = description,
        Question = questionform.get_as_xml(),
        QualificationRequirements = qualifications
    )

    HIT = create_hit_result['HIT']

    print('[create_hit( %s, $%s ): %s]' % (URL, reward, HIT["HITId"]))
    print(HIT["HITId"])

    return HIT["HITId"]

if __name__ == "__main__":
    print("test create hit")
    