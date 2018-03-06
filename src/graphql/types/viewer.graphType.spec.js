import sinon from "sinon";
import { assert } from "chai";
import ViewerGraphType from "./viewer.graphType";

describe("viewer", () => {
	it("mostComplaintsBy populates args", () => {
		const { mostComplaintsBy } = ViewerGraphType.getFields();
		const { resolve } = mostComplaintsBy;

		const sql = `select product, count(product)\n\tas counts from complaints where state = 'OH'\n\tgroup by product order by counts desc limit 100`;
		const db = {
			query: () => Promise.resolve({
				rows: [{ a: "value" }]
			})
		};
		const dbspy = sinon.spy(db, "query");

		resolve("root", { returnCompanyOrProduct: "product", state: "OH" }, { db })
			.then(rows => {
				assert.equal(rows.length, 1);
			});

		assert.isOk(dbspy.calledOnce);
		assert.isOk(dbspy.calledWith(sql));
	});

	it("fastestGrowingStateFor populates args", () => {
		const { fastestGrowingStateFor } = ViewerGraphType.getFields();
		const { resolve } = fastestGrowingStateFor;

		const sql = `select c.state, \n\tround(cast(sum(p.change_percent)/count(c.state) as numeric), 2) as pchange \n\tfrom complaints c\n\tinner join populations p on (c.state = p.state)\n\twhere lower(c.compnay) like lower('Ditech%')\n\tgroup by c.state order by pchange desc`;
		
		const db = {
			query: () => Promise.resolve({
				rows: []
			})
		};
		const dbspy = sinon.spy(db, "query");

		resolve("root", { byCompanyOrProduct: "compnay", byCompanyOrProductValue: "Ditech" }, { db })
			.then(rows => {
				assert.equal(rows.length, 0);
			});

		assert.isOk(dbspy.calledOnce);
		assert.isOk(dbspy.calledWith(sql));
	});

	it("populationChangeEachStateForComplaintsBy populates args", () => {
		const { populationChangeEachStateForComplaintsBy } = ViewerGraphType.getFields();
		const { resolve } = populationChangeEachStateForComplaintsBy;

		const sql = `\n\tselect p.state, round(cast(sum(p.change_percent)/count(p.state) as numeric), 2) as pchange\n\tfrom populations p\n\twhere p.state = any(select distinct state from complaints \n\twhere lower(compnay) like lower('Bank of America%'))\n\tgroup by p.state\n\torder by pchange desc\n`;
		
		const db = {
			query: () => Promise.resolve({
				rows: []
			})
		};
		const dbspy = sinon.spy(db, "query");

		resolve("root", { byCompanyOrProduct: "compnay", byCompanyOrProductValue: "Bank of America" }, { db })
			.then(rows => {
				assert.equal(rows.length, 0);
			});

		assert.isOk(dbspy.calledOnce);
		assert.isOk(dbspy.calledWith(sql));
	});
});