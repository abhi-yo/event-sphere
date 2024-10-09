import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (v: number[]) {
          return (
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 && // longitude
            v[1] >= -90 &&
            v[1] <= 90
          ); // latitude
        },
        message: (props) =>
          `${props.value} is not a valid location coordinate!`,
      },
    },
  },
});

EventSchema.index({ location: "2dsphere" });

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
