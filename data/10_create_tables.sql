CREATE TABLE complaints 
(Date_received date,Product varchar,Sub_product varchar,Issue varchar,
 Sub_issue varchar, Consumer_complaint_narrative varchar,
 Company_public_response varchar,Company varchar,State char(2),ZIP_code char(5),
 Tags varchar,Consumer_consent_provided varchar,Submitted_via varchar,
 Date_sent_to_company date,Company_response_to_consumer varchar,
 Timely_response varchar,Consumer_disputed varchar,Complaint_ID varchar);
 

CREATE TABLE populations
(Id varchar,Id2 varchar,Geography varchar,Target_Geo_Id varchar,
Target_Geo_Id2 varchar,Rank int,Geography1 varchar,Geography2 varchar,
estimate_2014 int, estimate_2015 int, change_number int,change_percent float(1));


CREATE TABLE state_lookup
(name varchar,abbrev char(2))


