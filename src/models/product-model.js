import { connectionDB } from '../db/db.js'

class Products {
    constructor(connectionDB) {
        this._connection = connectionDB;
        this._dbName = process.env.MDB_TABLE_NAME_ECOM;
    };

    //CREATE DATABASE
    async createDataBaseProducts() {
        try {
            const tableExist = await this._connection.schema.hasTable(this._dbName);

            if(!tableExist) {
                //Create table
                await this._connection.schema.createTable(this._dbName, productsTable => {
                    productsTable.increments('id').unique().notNullable().primary()
                    productsTable.string('name', 50).notNullable()
                    productsTable.timestamp('created_at').defaultTo(this._connection.fn.now())
                    productsTable.float('price').notNullable()
                    productsTable.integer('stock').notNullable()
                    productsTable.text('url')
                });

                console.log('Table Created!');
            };
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //TABLE EXIST
    async tableExist() {
        try {
            return await this._connection.schema.hasTable(this._dbName);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //INSERT DATA
    async insertData(product) {
        try {
            await this._connection(this._dbName).insert(product);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //GET DATA
    async getProducts() {
        try {
            return await this._connection(this._dbName).select('name', 'price', 'stock', 'url');
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //Update a product
    async updateProduct(id, data) {
        try {
            const product = data;
            product.id = id;
            await this._connection(this._dbName).where({ id }).update(data);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //Delete a product
    async deleteProduct(id) {
        try {
            await this._connection(this._dbName).where({ id }).del();
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };
};

export default new Products(connectionDB);