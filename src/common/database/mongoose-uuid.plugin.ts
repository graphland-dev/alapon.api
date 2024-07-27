import { v4 as uuidv4 } from 'uuid';

export const mongooseUUID = (schema: any) => {
  //   if (!schema.paths._id) {
  //     schema.add({
  //       _id: {
  //         type: String,
  //         index: { unique: true },
  //       },
  //     });
  //   }

  schema.pre('save', function (next) {
    const uid = uuidv4();
    if (this.isNew) {
      this._id = uid;
    }
    return next();
  });
};
