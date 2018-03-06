import sinon from "sinon";
import { assert } from "chai";
import ViewerGraphType from "./viewer.graphType";

describe("viewer", () => {
	it("mostComplaintsBy populates args", () => {
		const { mostComplaintsBy } = ViewerGraphType.getFields();
		const { resolve } = mostComplaintsBy;

		const db = {
			query: () => Promise.resolve({
				rows: [{ a: "value" }]
			})
		};
		const dbspy = sinon.spy(db, "query");

		const testByProduct = "product";
		const testState = "OH";

		resolve("", { returnCompanyOrProduct: testByProduct, state: testState }, { db })
			.then(rows => {
				assert.equal(rows.length, 1);
			});

		const queriedSql = dbspy.getCall(0).args[0];
		assert.isOk(dbspy.calledOnce);
		assert.isOk(queriedSql.includes(testByProduct));
		assert.isOk(queriedSql.includes(testState));
	});

	it("fastestGrowingStateFor populates args", () => {
		const { fastestGrowingStateFor } = ViewerGraphType.getFields();
		const { resolve } = fastestGrowingStateFor;

		const db = {
			query: () => Promise.resolve({
				rows: []
			})
		};
		const dbspy = sinon.spy(db, "query");

		const testByCompany = "compnay";
		const testCompany = "Ditech";

		resolve("", { byCompanyOrProduct: testByCompany, byCompanyOrProductValue: testCompany }, { db })
			.then(rows => {
				assert.equal(rows.length, 0);
			});

		const queriedSql = dbspy.getCall(0).args[0];
		assert.isOk(dbspy.calledOnce);
		assert.isOk(queriedSql.includes(testByCompany));
		assert.isOk(queriedSql.includes(testCompany));
	});

	it("populationChangeEachStateForComplaintsBy populates args", () => {
		const { populationChangeEachStateForComplaintsBy } = ViewerGraphType.getFields();
		const { resolve } = populationChangeEachStateForComplaintsBy;

		const db = {
			query: () => Promise.resolve({
				rows: []
			})
		};
		const dbspy = sinon.spy(db, "query");

		const testByCompany = "company";
		const testCompany = "Bank of America";

		resolve("", 
			{ byCompanyOrProduct: testByCompany, byCompanyOrProductValue: testCompany },
			{ db })
			.then(rows => {
				assert.equal(rows.length, 0);
			});

		const queriedSql = dbspy.getCall(0).args[0];
		assert.isOk(dbspy.calledOnce);
		assert.isOk(queriedSql.includes(testByCompany));
		assert.isOk(queriedSql.includes(testCompany));
	});
});