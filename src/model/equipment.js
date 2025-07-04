const mongoose = require('mongoose')

const EquipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["cardio", "strength", "free-weights", "machine"],
            required: true
        },
        description: {
            type: String
        },
        targetMuscles: {
            type: []
        }
    },
    {
        timestamps: true
    }
)



module.exports = mongoose.model("Equipment", EquipmentSchema)