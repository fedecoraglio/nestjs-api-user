import { Expose, Transform } from 'class-transformer';

export function ExposeObjectId() {
  return (obj: Object, key: string) => {
    Transform(({ obj, key }) => obj[key]?.toString())(obj, key);
    Expose({ name: 'id' })(obj, key);
  };
}
