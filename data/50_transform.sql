ALTER TABLE populations 
	add column city varchar, 
	add column state_name varchar,
	add column state char(2);
update populations set city = (select trim(from split_part(geography2, ',', 1)));
update populations set state_name = (select trim(from split_part(geography2, ',', 2)));
update populations set state = sl.abbrev from state_lookup sl
where populations.state_name = sl.name;