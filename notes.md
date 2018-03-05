

variables: product, complaints, state, company, population change, date range
reporting (sql) vs searching (elasticsearch)

aggregate population change with date range
most complaints
fastest growing state
by company


datasets (2014-2015)
matching states abbrev to name (US only)


* What product has the most complaints in the State of New York?

select product, count(product) as pcount from complaints 
where state = 'NY'
group by product
order by pcount desc


SELECT split_part(geography2, ',', 1) AS city,
    split_part(geography2, ',', 2) AS state_name
FROM populations;


* What is the aggregate population change between 2014 and 2015 in each state where
Bank of America received a consumer complaint?

select distinct state from complaints where lower(company) like lower('Bank of America%');
select sum(change_number), sum(change_percent) from populations
where state_name = 'Alaska'

select p.state, sum(p.change_percent)
from populations p
where p.state = any(select distinct state from complaints 
where lower(company) like lower('Bank of America%'))
group by p.state
order by sum desc


* What is the fastest growing state that also has the most complaints for payday loans?

select c.state, count(c.state) as scount, sum(p.change_percent)
from complaints c
inner join populations p on (c.state = p.state)
where lower(c.company) like lower('payday%')
group by c.state
order by scount desc


