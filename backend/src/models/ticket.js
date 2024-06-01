import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchaseDatetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: [
        {
            type: Object
            //type: Schema.Types.ObjectId,
            // ref: 'products'  ERROR era guardar todo el objeto ( type: object) y no gurdar la referencia
        }
    ]
})

const ticketModel = model('ticket', ticketSchema)
export default ticketModel;