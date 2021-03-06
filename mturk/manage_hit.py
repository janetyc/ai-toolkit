from mturk.create_hit import *
from datetime import datetime
import sys
import os
import io
import csv

mtc = mturk

def get_all_hits():
    hits_res = mtc.list_hits()
    hits = hits_res['HITs']
    for i, hit in enumerate(hits):
        print("%d: %s (%s)" % (i, hit["HITId"], hit["HITStatus"]))

def get_all_reviewable_hits(page_size=100):
    paginator = mtc.get_paginator('list_reviewable_hits')
    all_hits = []
    for i, batch in enumerate(paginator.paginate(PaginationConfig={'PageSize': page_size})):
        print("Request hits page %i" % (i + 1))
        all_hits.extend(batch['HITs'])
    return all_hits

# def get_all_reviewable_hits(page_size=50):
#     hits = mtc.list_reviewable_hits()
#     print("Total results to fetch %s " % hits.NumResults)
#     print("Request hits page %i" % 1)

#     total_pages = float(hits.NumResults)/page_size
#     int_total= int(total_pages)
#     if(total_pages-int_total>0):
#         total_pages = int_total+1
#     else:
#         total_pages = int_total
#     pn = 1
#     while pn < total_pages:
#         pn = pn + 1
        
#         print("Request hits page %i" % pn)
#         temp_hits = mtc.get_reviewable_hits(page_size=page_size,page_number=pn)
#         hits.extend(temp_hits)

#     return hits

def show_assignments(hit_id):    
    assignments = get_assignments(hit_id)
    print("====== show assignments ======")
    for i, assignment in enumerate(assignments):
        print("assign #%i" % i)
        show_assignment(assignment)
        print("---------------")

def show_assignment(assignment):
    print("Assignment:")
    print(assignment)
    print("id: %s" % assignment["AssignmentId"])
    print("WorkerId: %s" % assignment["WorkerId"])
    print("HITId: %s" % assignment["HITId"])
    print("status: %s" % assignment["AssignmentStatus"])
    print("accept time: %s" % assignment["AcceptTime"])
    print("submit time: %s" % assignment["SubmitTime"])
    print("Answer: %s" % assignment["Answer"])

    return assignment

def show_hit(hit):
    print("====== show hit ======")
    print("hit id: %s" % hit["HITId"])
    print("expiration: %s" % hit["Expiration"])
    print("title: %s" % hit["Title"])
    print("status: %s" % hit["HITStatus"])
    print("review status: %s" % hit["HITReviewStatus"])
    
    show_assignments(hit["HITId"])
    print("------")

def get_hit(hit_id):
    hit = mtc.get_hit(HITId=hit_id)['HIT']
    return hit

def get_assignments(hit_id):
    assignments = mtc.list_assignments_for_hit(HITId=hit_id)
    
    return assignments['Assignments']

def get_assignment(assignment_id):
    assignment = mtc.get_assignment(assignment_id)

def expire_hit(hit_id):
    expired = mtc.update_expiration_for_hit(
        HITId = hit_id,
        ExpireAt=datetime(2015, 1, 1)
    )
    return expired

def delete_hit(hit_id):
    expire_hit(hit_id)
    delete = mtc.delete_hit(HITId=hit_id)
    return delete

def approve_rejected_assignment(assignment_id, feedback=None):
    approve = mtc.approve_rejected_assignment(assignment_id)
    print("approve rejected assignment - %s" % assignment_id)

def approve_hit(hit_id):
    assignments = get_assignments(hit_id)
    for assignment in assignments:
        approve = approve_assignment(assignment["AssignmentId"])

    print("finish approving hit - %s" % hit_id)

def approve_assignment(assignment_id):
    approve = mtc.approve_assignment(AssignmentId=assignment_id)
    print("approve assignment - %s" % assignment_id)

# need to modify
def save_data(hit_id):
    hit = get_hit(hit_id)
    assignments = get_assignments(hit_id)

    output = []
    output.append(["hit_id","annotation","assignment_id","worker_id","status","accept_time","submit_time","answer"])

    for assignment in assignments:
        answer_list = []
        for question_form_answer in assignment.answers[0]:
            field_id = question_form_answer.qid
            field_value = question_form_answer.fields
            answer_list.append(field_value[0])

        answer = "|".join(answer_list)

        output.append([assignment.HITId, hit.RequesterAnnotation, assignment.AssignmentId, assignment.WorkerId, 
                        assignment.AssignmentStatus, assignment.AcceptTime, assignment.SubmitTime, answer])
    
    filename = "%s-result.csv" % hit_id
    f = open(filename, 'w')
    with f:
        writer = csv.writer(f)
        writer.writerows(output)

    print("%s save!" % filename)

if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("python manage_hit.py get_all_hits")
        print("python manage_hit.py show_assignment assignment_id")
        print("python manage_hit.py unreject assignment_id")
        print("python manage_hit.py expire_hit hit_id")
        print("python manage_hit.py delete_hit hit_id")
        print("python manage_hit.py show_hit hit_id")

        print("python manage_hit.py approve_hit hit_id")
        print("python manage_hit.py approve_assignment assignment_id")
        print("python manage_hit.py save_data hit_id")
        exit(0)
    else:
        function = sys.argv[1]

        if len(sys.argv) == 2:
            if function == "get_all_hits":
                get_all_hits()
                exit(0)

            if function == "get_all_reviewable_hits":
                get_all_reviewable_hits()
                exit(0)
                
            print("python manage_hit.py get_all_hits")

            print("python manage_hit.py show_assignment assignment_id")
            print("python manage_hit.py unreject assignment_id")
            print("python manage_hit.py expire_hit hit_id")
            print("python manage_hit.py delete_hit hit_id")
            print("python manage_hit.py show_hit hit_id")
            
            print("python manage_hit.py approve_hit hit_id")
            print("python manage_hit.py approve_assignment assignment_id")

            print("python manage_hit.py save_data hit_id")
            exit(0)

        if function == "show_assignment":
            assignment_id = sys.argv[2]
            assignment = get_assignment(assignment_id)
            show_assignment(assignment)
            
        elif function == "expire_hit":
            hit_id = sys.argv[2]
            expire = expire_hit(hit_id)
            print("expire hit: %s" % hit_id)
            print(expire)

        elif function == "delete_hit":
            hit_id = sys.argv[2]
            delete = delete_hit(hit_id)
            print("delete hit: %s" % hit_id)
            print(delete)

        elif function == "unreject":
            assignment_id = sys.argv[2]
            approve_rejected_assignment(assignment_id)
            print("unreject assignment %s" % assignment_id)

        elif function == "show_hit":
            hit_id = sys.argv[2]
            hit = get_hit(hit_id)
            show_hit(hit)

        elif function == "approve_hit":
            hit_id = sys.argv[2]
            approve_hit(hit_id)
            
        elif function == "approve_assignment":
            assignment_id = sys.argv[2]
            approve_assignment(assignment_id)
        
        elif function == "save_data":
            hit_id = sys.argv[2]
            save_data(hit_id)
